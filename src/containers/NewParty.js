import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import { useHistory } from "react-router-dom";
import axios from "axios";
import uid2 from "uid2";

// import CSS
import "./NewParty.css";

// import des composants
import Header from "../components/Header";
import Button from "../components/Button";
import EnterPseudo from "../components/EnterPseudo";

const NewParty = ({
  player,
  api,
  setPlayerToken,
  playersNumber,
  timer,
  roles,
}) => {
  const [isPlayerUnknown, setIsPlayerUnknown] = useState(false);
  const [nickname, setNickname] = useState("");

  const history = useHistory();

  const handleSubmit = async () => {
    if (!player) {
      setIsPlayerUnknown(true);
    } else {
      try {
        const response = await axios.post(
          `${api}/party/new`,
          {
            playersNumber,
            roles,
          },
          {
            headers: {
              authorization: `Bearer ${player.token}`,
            },
          }
        );

        if (response.status === 200) {
          history.push(`/partie/${response.data.party.code}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmitWithPseudo = async () => {
    const token = uid2(16);

    try {
      const response = await axios.post(
        `${api}/party/new`,
        {
          playersNumber,
          roles,
          nickname,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setPlayerToken(token, response.data.player);
        history.push(`/partie/${response.data.party.code}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="NewParty">
      <Header title="Créer" rightTitle="Undercover" back="/jouer" />
      <div className="wrapper">
        <div>
          <h2>Paramètres de votre partie :</h2>
          <ul>
            <li>Nombre de joueurs : {playersNumber}</li>
            <li>
              Rôles : {roles.civils} enquêteur(s) / {roles.undercovers}{" "}
              imposteur(s) / {roles.mrwhite} Mr. L
            </li>
            <li>Temps de vote : {timer} minutes</li>
          </ul>
        </div>
        <div className="NewParty-button">
          <Button title="Valider" onClick={handleSubmit} />
        </div>
      </div>
      {isPlayerUnknown && (
        <EnterPseudo setInput={setNickname} onClick={handleSubmitWithPseudo} />
      )}
    </div>
  );
};

export default NewParty;
