import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import socketClient from "socket.io-client";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";

// import CSS
import "./Party.css";

// import des composants
import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import PartyInProgress from "../components/PartyInProgress";
import Timer from "../components/Timer.js";

const Party = ({ player, api, token }) => {
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
  const [minutes, setMinutes] = useState(1);
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
        setParty(party);
        setPlayerPlaying(null);
        setPreviousPlay(null);
        setIsLapOver(false);
        setPlayerVoteAgainst(null);
        setIsResultDisplayed(false);
        setEliminatedPlayer({});
        setIsTimerActive(false);
        setIsMrWhiteSubmitted(false);
        setMrWhiteWord("");
        setMinutes(1);
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
            setPlayerPlaying(null);
            setTimeout(() => {
              socket.emit("client-lapOver", party);
            }, 3000);
          }
        }

        setIsPartyStarted(true);
      }
    );

    socket.on("server-lapOver", (party) => {
      setParty(party);
      setIsLapOver(true);
      // setTimeout(() => {
      //   socket.emit("client-closeVotes", playerVoteAgainst);
      // }, 30000);
    });

    socket.on("server-startTimer", (mins) => {
      setIsTimerActive(true);
      setMinutes(mins - 1);
      setSeconds(59);
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
    history.push({ pathname: "/", state: "reload" });
  };

  const handleStartParty = () => {
    const socket = socketClient(api, { transports: ["websocket"] });
    socket.emit("startParty", code);
  };

  const handlePlay = () => {
    const socket = socketClient(api, { transports: ["websocket"] });
    const inputValue = input.toLowerCase();
    for (let i = 0; i < party.wordsAlreadyUsed.length; i++) {
      console.log();
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
          }, 15000);
        }
      }
    } catch (err) {
      console.log(err);
    }
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
      <Header rightTitle="Undercover" back="/" />
      {isMrWhiteSubmitted ? (
        next === "WHITE_WINS" ? (
          <div>
            {eliminatedPlayer.nickname} (Mr L) a découvert le mot des civils! Il
            s'agissait de {mrWhiteWord}. Défaite des civils!
          </div>
        ) : (
          <>
            <div>
              {eliminatedPlayer.nickname} (Mr L) s'est trompé sur le mot des
              civils, voici le mot qu'il pensait être le bon : {mrWhiteWord}
            </div>
            {player._id === party.moderator_id && (
              <Button title="Next" onClick={handleNextLap} />
            )}
          </>
        )
      ) : isResultDisplayed ? (
        <div>
          {eliminatedPlayer.length === 1 ? (
            <div>
              {eliminatedPlayer[0].nickname} a été éliminé, il s'agissait d'un{" "}
              {eliminatedPlayer[0].role === "mrwhite"
                ? "Mr L"
                : eliminatedPlayer[0].role}
              <div>
                <h4>
                  Personnes ayant votés contre {eliminatedPlayer[0].nickname} :
                </h4>
                {eliminatedPlayer[0].votes.map((item) => {
                  return <p key={item._id}>{item.nickname}</p>;
                })}
              </div>
            </div>
          ) : (
            <div>
              Les joueurs suivant sont à égalité au niveau des votes, il faut
              faire un choix :
            </div>
          )}
          {next === "WHITE" ? (
            player._id === eliminatedPlayer[0]._id && (
              <div>
                <h2>
                  Tu as été découvert, tentes ta chance et essayes de découvrir
                  le mot des civils pour gagner
                </h2>
                <Input setInput={setMrWhiteWord} />
                <Button title="Valider" onClick={handleMrWhiteWord} />
              </div>
            )
          ) : next === "OVER" ? (
            <div>
              <h2>Victoire des undercovers! On rejoue ?</h2>
              <Button title="Rejouer" onClick={goBackHome} />
            </div>
          ) : next === "NEXT" ? (
            player._id === party.moderator_id && (
              <Button title="Next" onClick={handleNextLap} />
            )
          ) : next === "EQUAL" ? (
            <>
              {eliminatedPlayer.map((player) => {
                console.log(player.nickname);
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
              })}
              <Timer
                isTimerActive={isTimerActive}
                minutes={minutes}
                seconds={seconds}
                party={party}
                player={player}
                setMinutes={setMinutes}
                handleCountDown={handleCountDown}
              />
            </>
          ) : (
            <div>
              <h2>Victoire des civils! On rejoue ?</h2>
              <Button title="Rejouer" onClick={goBackHome} />
            </div>
          )}
          {/* {isMrWhiteSubmitted && <div>Le mot ta</div>} */}
        </div>
      ) : isLapOver ? (
        <div>
          <h2>Votes :</h2>
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
          })}
          {
            <Timer
              isTimerActive={isTimerActive}
              minutes={minutes}
              seconds={seconds}
              party={party}
              player={player}
              setMinutes={setMinutes}
              handleCountDown={handleCountDown}
            />
          }
          {/* {isTimerActive ? (
            <div>
              {minutes} : {seconds < 10 ? `0${seconds}` : seconds}
            </div>
          ) : (
            party.moderator_id === player._id && (
              <>
                <FormControl>
                  <InputLabel id="select-minutes">Minutes</InputLabel>
                  <Select
                    labelId="select-minutes"
                    id="select-minutes"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                  </Select>
                </FormControl>
                <Button title="Démarrer le timer" onClick={handleCountDown} />
              </>
            )
          )} */}
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
        //   <>
        //   <h2>Liste des joueurs :</h2>
        //   {party.players.map((player) => {
        //     return <div key={player._id}>{player.nickname}</div>;
        //   })}
        //   <h2>Mes mots déjà joués :</h2>
        //   {words.map((word, index) => {
        //     return <p key={index}>{word}</p>;
        //   })}
        //   {previousPlay && previousPlay.nickname && (
        //     <div>
        //       Dernier mot joué par {previousPlay.nickname} est{" "}
        //       {previousPlay.value}
        //     </div>
        //   )}
        //   {playerPlaying ? (
        //     playerPlaying._id === player._id ? (
        //       <>
        //         <Input
        //           label="Mot"
        //           placeholder="Ex: chien"
        //           setInput={setInput}
        //         />
        //         <Button title="Jouer" onClick={handlePlay} />
        //       </>
        //     ) : (
        //       <div>{playerPlaying.nickname} est en train de jouer ...</div>
        //     )
        //   ) : (
        //     <div>
        //       Tu as retenu les mots de chacun ? Les votes ont lieu dans quelques
        //       secondes ...
        //     </div>
        //   )}
        // </>
        <>
          <div>
            <Button title="Retour" onClick={goBackHome} />
          </div>

          {isLoading ? (
            <div>Chargement</div>
          ) : (
            <>
              <div className="Party-code-container">
                <div>Code de la partie : {party.code}</div>
              </div>
              <div className="Party-playersList-container">
                <h2>Liste des joueurs :</h2>
                <div>
                  {party.players.length} / {playersNumber} joueurs
                </div>
              </div>

              {party.players.map((player) => {
                return <div key={player._id}>{player.nickname}</div>;
              })}
              {party.players.length === playersNumber && player ? (
                // player &&
                party.moderator_id === player._id && (
                  <Button
                    title="Démarrer la partie"
                    onClick={handleStartParty}
                  />
                )
              ) : (
                <div>En attente d'autres joueurs ...</div>
              )}
            </>
          )}
        </>
      )}
      {/* // {} */}
    </div>
  );
};

export default Party;
