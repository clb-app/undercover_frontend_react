import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import socketClient from "socket.io-client";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import CSS
import "./Party.css";

// import des composants
import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import PartyInProgress from "../components/PartyInProgress";
import Timer from "../components/Timer.js";

import rocketsImg from "../assets/images/torpedo_2.jpg";
import civilImg from "../assets/images/emojione_person-shrugging.png";
import imposteurImg from "../assets/images/imposteur.png";
import mrlImg from "../assets/images/mr_l.png";

const Party = ({ player, api, token, timer, setReload }) => {
  const { code } = useParams();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [party, setParty] = useState(null);
  const [playersNumber, setPlayersNumber] = useState(1);
  const [isPartyStarted, setIsPartyStarted] = useState(false);
  const [playerPlaying, setPlayerPlaying] = useState(null);
  const [input, setInput] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [previousPlay, setPreviousPlay] = useState(null);
  const [isLapOver, setIsLapOver] = useState(false);
  const [playerVoteAgainst, setPlayerVoteAgainst] = useState(null);
  const [minutes, setMinutes] = useState(timer);
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isResultDisplayed, setIsResultDisplayed] = useState(false);
  const [eliminatedPlayer, setEliminatedPlayer] = useState({});
  const [next, setNext] = useState(null);
  const [mrWhiteWord, setMrWhiteWord] = useState("");
  const [isMrWhiteSubmitted, setIsMrWhiteSubmitted] = useState(false);
  const [words, setWords] = useState([]);
  const [myWord, setMyWord] = useState(null);

  useEffect(() => {
    const socket = socketClient(api, { transports: ["websocket"] });
    if (isLoading) {
      socket.emit("joinParty", { code, token });
    }

    socket.on("updateParty", (data) => {
      setPlayersNumber(data.players_number);
      for (let i = 0; i < data.players.length; i++) {
        if (data.players[i].token === token) {
          setParty(data);
          setIsLoading(false);
          break;
        }
      }
    });

    socket.on(
      "server-startParty",
      async (party, previousValue, previousPlayerNickname) => {
        setIsMrWhiteSubmitted(false);
        setParty(party);
        setPlayerPlaying(null);
        setPreviousPlay(null);
        setIsLapOver(false);
        setPlayerVoteAgainst(null);
        setIsResultDisplayed(false);
        setEliminatedPlayer({});
        setIsTimerActive(false);
        setMrWhiteWord("");
        setMinutes(timer);
        setSeconds(0);
        setNext(null);

        if (!myWord) {
          for (let i = 0; i < party.players.length; i++) {
            if (token === party.players[i].token) {
              setMyWord(party.players[i].word);
            }
          }
        }

        for (let i = 0; i < party.players.length; i++) {
          if (!party.players[i].isAlreadyPlayed && party.players[i].alive) {
            setPlayerPlaying(party.players[i]);
            if (i > 0) {
              setPreviousPlay({
                value: previousValue,
                nickname: previousPlayerNickname,
              });
            }
            break;
          } else if (i + 1 === party.players.length) {
            setPreviousPlay({
              value: previousValue,
              nickname: previousPlayerNickname,
            });

            setPlayerPlaying("last");
            setTimeout(() => {
              socket.emit("client-lapOver", party);
            }, 5000);
          }
        }

        setIsPartyStarted(true);
      }
    );

    socket.on("server-lapOver", (party) => {
      setParty(party);
      setTimeout(() => {
        setPlayerPlaying(null);
        setTimeout(() => {
          setIsLapOver(true);
        }, 5000);
      }, 10000);
      // setIsLapOver(true);
      // setTimeout(() => {
      //   socket.emit("client-closeVotes", playerVoteAgainst);
      // }, 30000);
    });

    socket.on("server-startTimer", (mins) => {
      setIsTimerActive(true);
      setMinutes(mins - 1);
      setSeconds(59);
    });

    socket.on("server-stopTimer", () => {
      setMinutes(0);
      setSeconds(0);
    });

    socket.on("server-mrWhiteWord", (checkWord, word) => {
      let result = checkWord ? "WHITE_WINS" : "WHITE_OVER";
      setNext(result);
      setMrWhiteWord(word);
      setIsMrWhiteSubmitted(true);
    });
  }, []);

  useEffect(() => {
    if (isTimerActive) {
      const timer = setInterval(() => {
        if (
          (minutes === 1 ||
            minutes === 2 ||
            minutes === 3 ||
            minutes === 4 ||
            minutes === 5) &&
          seconds === 0
        ) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else if (minutes === 0 && seconds === 0) {
          handleCloseVotesAndShowResults();
          setIsTimerActive(false);
          clearInterval(timer);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [seconds]);

  const goBackHome = () => {
    setReload(true);
    history.push("/");
  };

  const handleStartParty = () => {
    const socket = socketClient(api, { transports: ["websocket"] });
    socket.emit("startParty", code);
  };

  const handlePlay = () => {
    const socket = socketClient(api, { transports: ["websocket"] });
    const inputValue = input.toLowerCase();
    for (let i = 0; i < party.wordsAlreadyUsed.length; i++) {
      if (errorInput) {
        setErrorInput("");
      }
      if (party.wordsAlreadyUsed[i] === inputValue) {
        setErrorInput(`Le mot ${inputValue} a déjà été joué.`);
        break;
      } else if (i + 1 === party.wordsAlreadyUsed.length) {
        const newWords = [...words];
        newWords.push(inputValue);
        setWords(newWords);
        socket.emit("client-play", inputValue, playerPlaying);
      }
    }
    if (party.wordsAlreadyUsed.length === 0) {
      const newWords = [...words];
      newWords.push(inputValue);
      setWords(newWords);
      socket.emit("client-play", inputValue, playerPlaying);
    }
  };

  const handleVoteAgainst = async (id) => {
    if (id !== player._id && player.alive) {
      try {
        const response = await axios.post(
          `${api}/party/vote`,
          {
            _id: id,
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setPlayerVoteAgainst(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCountDown = () => {
    const socket = socketClient(api, { transports: ["websocket"] });
    socket.emit("client-startTimer", minutes);
  };

  const handleCloseVotesAndShowResults = async () => {
    try {
      const response = await axios.post(`${api}/party/results`, {
        _id: party._id,
      });

      if (response.status === 200) {
        setEliminatedPlayer(response.data.eliminatedPlayer);
        setPlayerVoteAgainst(null);
        setNext(response.data.next);
        setIsResultDisplayed(true);
        if (response.data.next === "EQUAL") {
          setMinutes(timer);
          setSeconds(0);
          setTimeout(async () => {
            try {
              await axios.get(`${api}/player/reload-votes`, {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              });
            } catch (err) {
              console.log(err);
            }
          }, 5000);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleStopTimer = () => {
    const socket = socketClient(api, { transports: ["websocket"] });
    socket.emit("client-stopTimer");
  };

  const handleMrWhiteWord = () => {
    // socket emit client to server
    // io emit server to client
    const socket = socketClient(api, { transports: ["websocket"] });
    socket.emit("client-mrWhiteWord", party, mrWhiteWord);
  };

  const handleNextLap = () => {
    const socket = socketClient(api, { transports: ["websocket"] });
    socket.emit("client-nextLap", party, eliminatedPlayer[0]);
  };

  console.log("eliminatedPlayer =", eliminatedPlayer);

  return (
    <div className="Party">
      <Header rightTitle="Imposteur" back="/" setReload={setReload} />
      {isMrWhiteSubmitted ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {next === "WHITE_WINS" ? (
            <div style={{ textAlign: "center" }}>
              {eliminatedPlayer[0].nickname} (Mr L) a découvert le mot des
              enquêteurs! Il s'agissait de {mrWhiteWord}. Défaite des
              enquêteurs!
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center" }}>
                {eliminatedPlayer[0].nickname} (Mr L) s'est trompé sur le mot
                des enquêteurs, voici le mot qu'il pensait être le bon :{" "}
                {mrWhiteWord}
              </div>
              {player._id === party.moderator_id && (
                <div style={{ marginTop: "20px" }}>
                  <Button title="Prochain tour" onClick={handleNextLap} />
                </div>
              )}
            </>
          )}
        </div>
      ) : isResultDisplayed ? (
        <div className="Party-results-container">
          {eliminatedPlayer.length === 1 ? (
            <>
              <div className="Party-results-eliminatedPlayer-container">
                <div>
                  <span style={{ fontWeight: "700" }}>
                    {eliminatedPlayer[0].nickname}
                  </span>{" "}
                  a été éliminé
                </div>
                <img
                  src={
                    eliminatedPlayer[0].role === "civil"
                      ? civilImg
                      : eliminatedPlayer[0].role === "undercover"
                      ? imposteurImg
                      : mrlImg
                  }
                  alt="civil"
                  className="Party-isLapOver-img"
                />
                <div>
                  Il était{" "}
                  <span style={{ fontWeight: "700" }}>
                    {eliminatedPlayer[0].role === "mrwhite"
                      ? "Mr L"
                      : eliminatedPlayer[0].role === "civil"
                      ? "ENQUÊTEUR"
                      : "IMPOSTEUR"}
                  </span>
                </div>
              </div>
              <div className="Party-results-playersList-container">
                <div style={{ textAlign: "center" }}>
                  Personnes ayant voté contre {eliminatedPlayer[0].nickname} :
                </div>
                <div className="Party-results-playersList">
                  {eliminatedPlayer[0].votes.map((item) => {
                    return (
                      <div key={item._id} className="Party-results-player">
                        {item.nickname}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "10px" }}>
                <Timer
                  isTimerActive={isTimerActive}
                  minutes={minutes}
                  seconds={seconds}
                  party={party}
                  player={player}
                  setMinutes={setMinutes}
                  handleCountDown={handleCountDown}
                  handleStopTimer={handleStopTimer}
                />
              </div>
              <div>
                Les joueurs suivant sont à égalité au niveau des votes, il faut
                faire un choix :
              </div>
            </>
          )}
          {next === "WHITE" ? (
            player._id === eliminatedPlayer[0]._id && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <h2 style={{ textAlign: "center" }}>
                  Tu as été découvert, tentes ta chance et essayes de découvrir
                  le mot des enquêteurs pour gagner
                </h2>
                <Input setInput={setMrWhiteWord} placeholder="ex: chien" />
                <div style={{ marginTop: "20px" }}>
                  <Button title="Valider" onClick={handleMrWhiteWord} />
                </div>
              </div>
            )
          ) : next === "OVER" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <h2>Victoire des imposteurs! On rejoue ?</h2>
              <Button title="Rejouer" onClick={goBackHome} />
            </div>
          ) : next === "NEXT" ? (
            player._id === party.moderator_id && (
              <Button title="Prochain tour" onClick={handleNextLap} />
            )
          ) : next === "EQUAL" ? (
            <div className="Party-isLapOver-playersList-container">
              {eliminatedPlayer.map((player) => {
                console.log(player.nickname);
                return (
                  <div
                    key={player._id}
                    onClick={() => handleVoteAgainst(player._id)}
                    className="Party-isLapOver-player"
                    style={
                      playerVoteAgainst
                        ? playerVoteAgainst._id === player._id
                          ? {
                              background: "red",
                              color: "#fff",
                            }
                          : { background: "#EDEEEF" }
                        : { background: "#EDEEEF" }
                    }
                  >
                    {player.nickname}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <h2>Victoire des enquêteurs! On rejoue ?</h2>
              <Button title="Rejouer" onClick={goBackHome} />
            </div>
          )}
          {/* {isMrWhiteSubmitted && <div>Le mot ta</div>} */}
        </div>
      ) : isLapOver ? (
        <div className="Party-isLapOver-container">
          {/* <h2>Votes :</h2>
          {party.players.map((player) => {
            return (
              <div
                key={player._id}
                onClick={() => handleVoteAgainst(player._id)}
                style={
                  playerVoteAgainst
                    ? playerVoteAgainst._id === player._id
                      ? {
                          background: "red",
                        }
                      : { background: "#fff" }
                    : { background: "#fff" }
                }
              >
                {player.nickname}
              </div>
            );
          })} */}

          {
            <Timer
              isTimerActive={isTimerActive}
              minutes={minutes}
              seconds={seconds}
              party={party}
              player={player}
              setMinutes={setMinutes}
              handleCountDown={handleCountDown}
              handleStopTimer={handleStopTimer}
            />
          }
          <div className="Party-isLapOver-img-container">
            <img
              src={rocketsImg}
              alt="fusées"
              className="Party-isLapOver-img"
            />
            <div>C'est l'heure de faire sauter quelqu'un !</div>
            <div>Qui n'a pas sa place?</div>
          </div>
          <div className="Party-isLapOver-bottom-container">
            <div className="Party-isLapOver-playersList-container">
              {party.players.map((player) => {
                if (player.alive) {
                  return (
                    <div
                      key={player._id}
                      onClick={() => handleVoteAgainst(player._id)}
                      className="Party-isLapOver-player"
                      style={
                        playerVoteAgainst
                          ? playerVoteAgainst._id === player._id
                            ? {
                                background: "red",
                                color: "#fff",
                              }
                            : { background: "#EDEEEF" }
                          : { background: "#EDEEEF" }
                      }
                    >
                      {player.nickname}
                    </div>
                  );
                } else {
                  return <div key={player._id}></div>;
                }
              })}
            </div>
            <div className="PartyInProgress-right-container Party-isLapOver-wordsList-container">
              <h2>Liste de mots :</h2>
              {words.map((word, index) => {
                return <p key={index}>{word}</p>;
              })}
            </div>
          </div>
        </div>
      ) : isPartyStarted ? (
        <PartyInProgress
          party={party}
          previousPlay={previousPlay}
          playerPlaying={playerPlaying}
          words={words}
          player={player}
          setInput={setInput}
          handlePlay={handlePlay}
          myWord={myWord}
          errorInput={errorInput}
        />
      ) : (
        <>
          {isLoading ? (
            <div>Chargement</div>
          ) : (
            <div className="wrapper">
              <div>
                {party.players.length} / {playersNumber} joueurs
                {party.players.length === playersNumber && (
                  <span>. L'hôte peut désormais démarrer la partie</span>
                )}
              </div>
              <div className="Party-lobby-players-container">
                {party.players.map((player) => {
                  return (
                    <div key={player._id} className="Party-lobby-player">
                      <div>{player.nickname}</div>
                      {party.moderator_id === player._id && (
                        <div>
                          <FontAwesomeIcon icon="star" color="#F1B33B" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="Party-code-container">
                <div>Code partie : {party.code}</div>
              </div>
              {player &&
                (party.moderator_id === player._id ? (
                  party.players.length === playersNumber ? (
                    <Button title="Démarrer" onClick={handleStartParty} />
                  ) : (
                    <Button
                      title="Démarrer"
                      onClick={() => {}}
                      bgcColor="#D8D8D8"
                    />
                  )
                ) : (
                  <div></div>
                ))}
            </div>
          )}
        </>
      )}
      {/* // {} */}
    </div>
  );
};

export default Party;
