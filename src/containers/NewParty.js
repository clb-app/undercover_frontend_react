import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import { useHistory } from "react-router-dom";
import axios from "axios";

// import CSS
import "./NewParty.css";

// import des composants
import Button from "../components/Button";
import EnterPseudo from "../components/EnterPseudo";

const NewParty = ({ player, api }) => {
  const [sliderValue, setSliderValue] = useState(5);
  const [roles, setRoles] = useState({});
  const [isPlayerUnknown, setIsPlayerUnknown] = useState(false);

  useEffect(() => {
    switch (sliderValue) {
      case 3:
        setRoles({ civils: 2, undercovers: 1, mrwhite: 0 });
        break;
      case 4:
        setRoles({ civils: 3, undercovers: 1, mrwhite: 0 });
        break;
      case 5:
        setRoles({ civils: 3, undercovers: 1, mrwhite: 1 });
        break;
      case 6:
        setRoles({ civils: 4, undercovers: 1, mrwhite: 1 });
        break;
      case 7:
        setRoles({ civils: 4, undercovers: 2, mrwhite: 1 });
        break;
      case 8:
        setRoles({ civils: 5, undercovers: 2, mrwhite: 1 });
        break;
      case 9:
        setRoles({ civils: 5, undercovers: 3, mrwhite: 1 });
        break;
      case 10:
        setRoles({ civils: 6, undercovers: 3, mrwhite: 1 });
        break;
      case 11:
        setRoles({ civils: 6, undercovers: 3, mrwhite: 2 });
        break;
      case 12:
        setRoles({ civils: 7, undercovers: 3, mrwhite: 2 });
        break;
      case 13:
        setRoles({ civils: 7, undercovers: 4, mrwhite: 2 });
        break;
      case 14:
        setRoles({ civils: 8, undercovers: 4, mrwhite: 2 });
        break;
      case 15:
        setRoles({ civils: 8, undercovers: 5, mrwhite: 2 });
        break;
      case 16:
        setRoles({ civils: 9, undercovers: 5, mrwhite: 2 });
        break;
      case 17:
        setRoles({ civils: 9, undercovers: 5, mrwhite: 3 });
        break;
      case 18:
        setRoles({ civils: 10, undercovers: 5, mrwhite: 3 });
        break;
      case 19:
        setRoles({ civils: 10, undercovers: 6, mrwhite: 3 });
        break;
      case 20:
        setRoles({ civils: 10, undercovers: 6, mrwhite: 4 });
        break;
      default:
        break;
    }
  }, [sliderValue]);

  const history = useHistory();

  const handleSubmit = async () => {
    if (!player) {
      setIsPlayerUnknown(true);
    } else {
      try {
        const response = await axios.post(`${api}/party/new`, {
          player_id: player._id,
          playerNumber: sliderValue,
          roles,
        });

        if (response.status === 200) {
          history.push(`/party/${response.data.code}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="NewParty">
      <h2>{`${
        player
          ? "Alors " +
            player.nickname +
            " tu es prêt à lancer une nouvelle partie ?"
          : "Alors prêt à essayer?"
      }`}</h2>
      <h4>Nombre de joueurs ?</h4>
      <Slider
        style={{ width: "500px" }}
        value={sliderValue}
        valueLabelDisplay="on"
        min={3}
        max={20}
        onChange={(e, value) => setSliderValue(value)}
      />
      <h4>Les rôles ?</h4>
      <p>Civils : {roles.civils}</p>
      <p>Undercovers : {roles.undercovers}</p>
      <p>Mr White : {roles.mrwhite}</p>
      <Button title="Valider" onClick={handleSubmit} />
      {isPlayerUnknown && <EnterPseudo />}
    </div>
  );
};

export default NewParty;
