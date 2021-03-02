import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import socketClient from "socket.io-client";
import axios from "axios";

// import CSS
import "./Party.css";

// import des composants
import Button from "../components/Button";
import Input from "../components/Input";

const Party = ({ player, api, token }) => {
  const { code } = useParams();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [party, setParty] = useState(null);
  const [playersNumber, setPlayersNumber] = useState(1);
  const [isPartyStarted, setIsPartyStarted] = useState(false);
  const [playerPlaying, setPlayerPlaying] = useState(null);
  const [input, setInput] = useState("");
  const [previousPlay, setPreviousPlay] = useState(null);
  const [isLapOver, setIsLapOver] = useState(false);
  const [playerVoteAgainst, setPlayerVoteAgainst] = useState(null);

  const socket = socketClient(api, { transports: ["websocket"] });

  useEffect(() => {
    socket.emit("joinParty", { code, token });
    socket.on("updateParty", (data) => {
      setPlayersNumber(data.players_number);
      // console.log(data);
      for (let i = 0; i < data.players.length; i++) {
        if (data.players[i].token === token) {
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
          }, 10000);
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
  }, []);

  const goBackHome = () => {
    history.push("/");
  };

  const handleStartParty = () => {
    socket.emit("startParty", code);
  };

  const handlePlay = () => {
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

  console.log(playerVoteAgainst);

  return (
    <div className="Party">
      {isLapOver ? (
        party.players.map((player) => {
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
        })
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
    </div>
  );
};

export default Party;
