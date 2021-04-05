import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import { useHistory } from "react-router-dom";

// import CSS
import "./Options.css";

// import des composants
import Header from "../components/Header";
import Button from "../components/Button";

const Options = ({ playersNumber, setPlayersNumber }) => {
  const history = useHistory();

  const [roles, setRoles] = useState({});

  useEffect(() => {
    switch (playersNumber) {
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
  }, [playersNumber]);

  const handleValidate = () => {
    history.push("/");
  };

  return (
    <div className="Options">
      <Header title="Options" />
      <Slider
        style={{ width: "500px", margin: "20px", color: "var(--blue)" }}
        value={playersNumber}
        valueLabelDisplay="on"
        min={3}
        max={20}
        onChange={(e, value) => setPlayersNumber(value)}
      />
      <div className="NewParty-roles-container">
        <p>Civils : {roles.civils}</p>
        <p>Undercovers : {roles.undercovers}</p>
        <p>Mr White : {roles.mrwhite}</p>
      </div>
      <div className="NewParty-button">
        <Button title="Valider" onClick={handleValidate} />
      </div>
    </div>
  );
};

export default Options;
