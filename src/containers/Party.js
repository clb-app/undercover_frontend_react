import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import socketClient from "socket.io-client";
import axios from "axios";
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";

// import CSS
import "./Party.css";

// import des composants
import Button from "../components/Button";
import Input from "../components/Input";

const Party = ({ player, api, token }) => {
  const { code } = useParams();
  const history = useHistory();

  console.log(player);
  console.log(token);

  const [isLoading, setIsLoading] = useState(true);
  const [party, setParty] = useState(null);
  const [playersNumber, setPlayersNumber] = useState(1);
  const [isPartyStarted, setIsPartyStarted] = useState(false);
  const [playerPlaying, setPlayerPlaying] = useState(null);
  const [input, setInput] = useState("");
  const [previousPlay, setPreviousPlay] = useState(null);
  const [isLapOver, setIsLapOver] = useState(false);
  const [playerVoteAgainst, setPlayerVoteAgainst] = useState(null);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isResultDisplayed, setIsResultDisplayed] = useState(false);
  const [eliminatedPlayer, setEliminatedPlayer] = useState({});
  const [next, setNext] = useState(null);

  useEffect(() => {
    const socket = socketClient(api, { transports: ["websocket"] });
    console.log("first useEffect");
    if (isLoading) {
      console.log("first emit");
      socket.emit("joinParty", { code, token });
    }

    socket.on("updateParty", (data) => {
      console.log(data);
      setPlayersNumber(data.players_number);
      // console.log(data);
      for (let i = 0; i < data.players.length; i++) {
        if (data.players[i].token === token) {
          console.log("if");
          setParty(data);
          setIsLoading(false);
          break;
        }
      }
    });
    socket.on("server-startParty", (party) => {
      setParty(party);

      for (let i = 0; i < party.players.length; i++) {
        if (!party.players[i].isAlreadyPlayed) {
          setPlayerPlaying(party.players[i]);
          if (i > 0) {
            setPreviousPlay(party.players[i - 1]);
          }
          break;
        } else if (i + 1 === party.players.length) {
          setPreviousPlay(party.players[party.players.length - 1]);
          setPlayerPlaying(null);
          setTimeout(() => {
            socket.emit("client-lapOver", party);
          }, 3000);
        }
      }

      setIsPartyStarted(true);
    });

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
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [seconds]);

  const goBackHome = () => {
    history.push("/");
  };

  const handleStartParty = () => {
    const socket = socketClient(api, { transports: ["websocket"] });
    socket.emit("startParty", code);
  };

  const handlePlay = () => {
    const socket = socketClient(api, { transports: ["websocket"] });
    socket.emit("client-play", input, playerPlaying);
  };

  const handleVoteAgainst = async (id) => {
    if (id !== player._id) {
      console.log("if");
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
          console.log(response.data);
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
        setNext(response.data.next);
        setIsResultDisplayed(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="Party">
      {isResultDisplayed ? (
        <>
          <div>
            {eliminatedPlayer.nickname} a été éliminé, il s'agissait d'un{" "}
            {eliminatedPlayer.role}
          </div>
          {next === "WHITE" ? (
            player._id === eliminatedPlayer._id && (
              <div>Input pour écrire le mot des civils</div>
            )
          ) : next === "OVER" ? (
            <div>Victoire des undercovers! On rejoue ?</div>
          ) : next === "NEXT" ? (
            <div>Go prochain tour</div>
          ) : (
            <div>Victoire des civils! On rejoue ?</div>
          )}
        </>
      ) : isLapOver ? (
        <div>
          {party.players.map((player) => {
            // console.log(player);
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
          {isTimerActive ? (
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
          )}
        </div>
      ) : isPartyStarted ? (
        <>
          {party.players.map((player) => {
            return <div key={player._id}>{player.nickname}</div>;
          })}
          {previousPlay && (
            <div>
              Dernier mot joué par {previousPlay.nickname} est{" "}
              {previousPlay.words[0]}
            </div>
          )}
          {playerPlaying ? (
            playerPlaying._id === player._id ? (
              <>
                <Input
                  label="Mot"
                  placeholder="Ex: chien"
                  setInput={setInput}
                />
                <Button title="Jouer" onClick={handlePlay} />
              </>
            ) : (
              <div>{playerPlaying.nickname} est en train de jouer ...</div>
            )
          ) : (
            <div>
              Tu as retenu les mots de chacun ? Les votes ont lieu dans quelques
              secondes ...
            </div>
          )}
        </>
      ) : (
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
