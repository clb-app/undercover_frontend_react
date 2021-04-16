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

  console.log(roles);
  return (
    <div className="NewParty">
      <Header title="Créer" rightTitle="Imposteur" back="/jouer" />
      <div className="wrapper">
        <div>
          <h2>Paramètres de votre partie :</h2>
          <ul>
            <li className="NewParty-marginTop">
              Nombre de joueurs :{" "}
              <span className="NewParty-bold">{playersNumber}</span>
            </li>
            <div className="NewParty-marginTop">
              <li>
                <span className="NewParty-bold">{roles.civils}</span> enquêteur
                {roles.civils > 1 ? "s" : ""}
              </li>
              <li>
                <span className="NewParty-bold">{roles.undercovers}</span>{" "}
                imposteur
                {roles.undercovers > 1 ? "s" : ""}
              </li>
              <li>
                <span className="NewParty-bold">{roles.mrwhite}</span> Mr. L
              </li>
              <li className="NewParty-marginTop">
                Temps pour voter :{" "}
                <span className="NewParty-bold">{timer}</span> minutes
              </li>
            </div>
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
