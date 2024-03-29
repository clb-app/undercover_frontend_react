import React, { useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import { useHistory } from "react-router-dom";
import { Select, MenuItem, FormControl } from "@material-ui/core";

// import CSS
import "./Options.css";

// import des composants
import Header from "../components/Header";
import RoleItem from "../components/RoleItem";
import Button from "../components/Button";

const Options = ({
  playersNumber,
  setPlayersNumber,
  timer,
  setTimer,
  roles,
  setRoles,
  setReload,
  timerToPlay,
  setTimerToPlay,
}) => {
  const history = useHistory();

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

  const handleSubmit = () => {
    history.push("/");
  };

  return (
    <div className="Options">
      <Header
        title="Options"
        rightTitle="Imposteur"
        back="/"
        setReload={setReload}
      />
      <div className="wrapper">
        <Slider
          style={{ width: "300px", margin: "20px", color: "var(--blue)" }}
          value={playersNumber}
          valueLabelDisplay="on"
          min={3}
          max={20}
          onChange={(e, value) => setPlayersNumber(value)}
        />
        <div className="NewParty-roles-container">
          <RoleItem
            value={roles.civils}
            role={`Enquêteur${roles.civils > 1 ? "s" : ""}`}
          />
          <RoleItem
            value={roles.undercovers}
            role={`Imposteur${roles.undercovers > 1 ? "s" : ""}`}
          />
          <RoleItem value={roles.mrwhite} role="Mr. L" />
        </div>
        <div className="Options-timer-container">
          <div className="Options-timer-text">Temps de vote : </div>
          <FormControl>
            <Select
              labelId="select-minutes"
              id="select-minutes"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
            >
              <MenuItem value={1}>1 minute</MenuItem>
              <MenuItem value={2}>2 minutes</MenuItem>
              <MenuItem value={3}>3 minutes</MenuItem>
              <MenuItem value={4}>4 minutes</MenuItem>
              <MenuItem value={5}>5 minutes</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="Options-timer-container">
          <div className="Options-timer-text">Temps pour jouer :</div>
          <FormControl>
            <Select
              labelId="select-timer-player"
              id="select-timer-player"
              value={timerToPlay}
              onChange={(e) => setTimerToPlay(e.target.value)}
            >
              <MenuItem value={30}>30 secondes</MenuItem>
              <MenuItem value={45}>45 secondes</MenuItem>
              <MenuItem value={60}>60 secondes</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="NewParty-button">
          <Button
            title="Enregistrer"
            onClick={handleSubmit}
            bgcColor="var(--blue)"
          />
        </div>
      </div>
    </div>
  );
};

export default Options;
