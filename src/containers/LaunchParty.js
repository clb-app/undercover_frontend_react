import React from "react";
import { useHistory } from "react-router-dom";

// import CSS
import "./LaunchParty.css";

// import des composants
import Header from "../components/Header";
import Button from "../components/Button";

const LaunchParty = () => {
  const history = useHistory();

  const handleNewParty = () => {
    history.push("/creer");
  };

  const handleJoinParty = () => {
    history.push("/rejoindre");
  };

  return (
    <div className="LauchParty">
      <Header title="Jouer" rightTitle="Undercover" back="/" />
      <div className="LaunchParty-buttons-container">
        <Button title="Créer" onClick={handleNewParty} width="150px" />
        <Button
          title="Rejoindre"
          onClick={handleJoinParty}
          width="150px"
          bgcColor="#fff"
          color="var(--blue)"
          borderColor="var(--blue)"
        />
      </div>
    </div>
  );
};

export default LaunchParty;
