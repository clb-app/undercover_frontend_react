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
  handleStopTimer,
}) => {
  return isTimerActive ? (
    <>
      <div className="Timer">
        {minutes} : {seconds < 10 ? `0${seconds}` : seconds}
      </div>
      {party.moderator_id === player._id && (
        <div style={{ marginTop: "20px" }}>
          <Button title="Stop timer" onClick={handleStopTimer} />
        </div>
      )}
    </>
  ) : (
    party.moderator_id === player._id && (
      <div className="Timer-container">
        <FormControl>
          <InputLabel id="select-minutes">Temps</InputLabel>
          <Select
            labelId="select-minutes"
            id="select-minutes"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          >
            <MenuItem value={1}>1 minute</MenuItem>
            <MenuItem value={2}>2 minutes</MenuItem>
            <MenuItem value={3}>3 minutes</MenuItem>
            <MenuItem value={4}>4 minutes</MenuItem>
            <MenuItem value={5}>5 minutes</MenuItem>
          </Select>
        </FormControl>
        <div className="Timer-btn-container">
          <Button title="Démarrer le timer" onClick={handleCountDown} />
        </div>
      </div>
    )
  );
};

export default Timer;
