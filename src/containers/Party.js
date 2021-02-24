import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import socketClient from "socket.io-client";

// import CSS
import "./Party.css";

// import des composants
import Button from "../components/Button";

const Party = ({ player, api, token }) => {
  const { code } = useParams();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [party, setParty] = useState(null);
  const [playersNumber, setPlayersNumber] = useState(1);

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
  }, []);

  const goBackHome = () => {
    history.push("/");
  };

  console.log(player);

  return (
    <div className="Party">
      <div>
        <Button title="Retour" onClick={goBackHome} />
      </div>

      {isLoading ? (
        <div>Chargement</div>
      ) : (
        <>
          <h2>Liste des joueurs :</h2>
          <div>
            {party.players.length} / {playersNumber}
          </div>
          <div>{party.code}</div>
          {party.players.map((player) => {
            return <div key={player._id}>{player.nickname}</div>;
          })}
          {party.players.length === playersNumber ? (
            party.moderator_id === player._id && (
              <Button title="Démarrer la partie" />
            )
          ) : (
            <div>En attente d'autres joueurs ...</div>
          )}
        </>
      )}
    </div>
  );
};

export default Party;
