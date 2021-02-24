import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import socketClient from "socket.io-client";

// import CSS
import "./Party.css";

const Party = ({ player, api, token }) => {
  const { code } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [party, setParty] = useState(null);

  const socket = socketClient(api, { transports: ["websocket"] });

  useEffect(() => {
    socket.emit("joinParty", { code, token });
    socket.on("updateParty", (data) => {
      for (let i = 0; i < data.players.length; i++) {
        console.log("loop");
        console.log(player);
        if (data.players[i].token === token) {
          setParty(data);
          setIsLoading(false);
          break;
        }
      }
    });
  }, []);
  return (
    <div className="Party">
      <h2>Liste des joueurs :</h2>
      {isLoading ? (
        <div>Chargement</div>
      ) : (
        party.players.map((player) => {
          return <div key={player._id}>{player.nickname}</div>;
        })
      )}
    </div>
  );
};

export default Party;
