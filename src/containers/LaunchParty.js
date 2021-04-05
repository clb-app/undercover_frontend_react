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
    history.push("/new");
  };

  const handleJoinParty = () => {
    history.push("/join");
  };

  return (
    <div className="LauchParty">
      <Header title="Jouer" rightTitle="Undercover" />
      <Button title="Créer" onClick={handleNewParty} width="400px" />
      <Button title="Rejoindre" onClick={handleJoinParty} width="400px" />
    </div>
  );
};

export default LaunchParty;
