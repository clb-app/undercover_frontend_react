import React from "react";
import "./PartyInProgress.css";

// import des composants
import Input from "./Input";
import Button from "./Button";

const PartyInProgress = ({
  party,
  previousPlay,
  playerPlaying,
  words,
  player,
  setInput,
  handlePlay,
  myWord,
  errorInput,
}) => {
  return (
    <div className="PartyInProgress">
      <div className="PartyInProgress_top_container">
        <div>
          <h2>Liste des joueurs :</h2>
          {party.players.map((player) => {
            return <div key={player._id}>{player.nickname}</div>;
          })}
        </div>
        <div>
          <h3>
            {myWord ? `Votre mot est ${myWord}` : "Vous êtes Mr White :)"}
          </h3>
          <h2>Mes mots déjà joués :</h2>
          {words.map((word, index) => {
            return <p key={index}>{word}</p>;
          })}
        </div>
      </div>
      <div className="PartyInProgress_bottom_container">
        {previousPlay && previousPlay.nickname && (
          <div className="PartyInProgress_lastWord_text">
            Dernier mot joué par {previousPlay.nickname} est{" "}
            {previousPlay.value}
          </div>
        )}
        {playerPlaying ? (
          playerPlaying._id === player._id ? (
            <>
              {errorInput && (
                <p className="PartyInProgress_errorInput_text">{errorInput}</p>
              )}
              <Input
                label="À ton tour de jouer"
                placeholder="Ex: chien"
                setInput={setInput}
              />
              <Button title="Jouer" onClick={handlePlay} />
            </>
          ) : (
            <div>{playerPlaying.nickname} est en train de jouer ...</div>
          )
        ) : (
          <div>
            Tu as retenu les mots de chacun ? Les votes ont lieu dans quelques
            secondes ...
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyInProgress;
