import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import "./Timer.css";

// import des composants
import Button from "./Button";

const Timer = ({
  isTimerActive,
  minutes,
  seconds,
  party,
  player,
  setMinutes,
  handleCountDown,
}) => {
  return isTimerActive ? (
    <div className="Timer">
      <h2>
        {minutes} : {seconds < 10 ? `0${seconds}` : seconds}
      </h2>
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
  );
};

export default Timer;
