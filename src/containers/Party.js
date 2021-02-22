import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// import CSS
import "./Party.css";

const Party = ({ player, api, token }) => {
  const { code } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [party, setParty] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        console.log(token);
        console.log(code);
        const response = await axios.get(`${api}/party/status?code=${code}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setParty(response.data);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    })();
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
