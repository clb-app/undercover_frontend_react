import React from "react";
import "./PartyInProgress.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  console.log("partyInProgress =", playerPlaying);
  return (
    <div className="wrapper">
      <div className="PartyInProgress">
        <div className="PartyInProgress-left-container">
          <div className="PartyInProgress-players-container">
            {party.players.map((player) => {
              return (
                <div key={player._id} className="PartyInProgress-player">
                  <div
                    className={
                      player.alive ? "" : "PartyInProgress-player-eliminated"
                    }
                  >
                    {player.nickname}
                  </div>
                  {party.moderator_id === player._id && (
                    <div>
                      <FontAwesomeIcon icon="star" color="#F1B33B" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="PartyInProgress-middle-container">
          <div>
            {previousPlay && previousPlay.nickname && (
              <div className="PartyInProgress_lastWord_container">
                <div>Dernier mot joué par {previousPlay.nickname} :</div>
                <div className="PartyInProgress-lastWord-text">
                  {previousPlay.value}
                </div>
              </div>
            )}
          </div>
          <div>
            {playerPlaying ? (
              playerPlaying._id === player._id ? (
                <div className="PartyInProgress-playerPlaying-container">
                  <Input
                    label="C'est à votre tour !"
                    placeholder="Ex: chien"
                    setInput={setInput}
                  />
                  {errorInput && (
                    <p className="PartyInProgress_errorInput_text">
                      {errorInput}
                    </p>
                  )}
                  <div className="PartyInProgress-btn">
                    <Button title="Valider" onClick={handlePlay} />
                  </div>
                </div>
              ) : playerPlaying === "last" ? (
                <></>
              ) : (
                <div>
                  <span className="PartyInProgress-playerPlayingNickname">
                    {playerPlaying.nickname}
                  </span>{" "}
                  est en train de jouer ...
                </div>
              )
            ) : (
              <div className="PartyInProgress-lapOver-container">
                {/* {previousPlay && previousPlay.nickname && (
                  <div className="PartyInProgress_lastWord_container">
                    <div>Dernier mot joué par {previousPlay.nickname} :</div>
                    <div className="PartyInProgress-lastWord-text">
                      {previousPlay.value}
                    </div>
                  </div>
                )} */}
                <div>Le tour est terminé.</div>
                <div>Place aux votes !</div>
              </div>
            )}
          </div>
          <div className="PartyInProgress-myWord-container">
            {myWord ? (
              <>
                <div>Mot commun à votre groupe :</div>
                <div className="PartyInProgress-myWord-text">{myWord}</div>
              </>
            ) : (
              <div>Vous êtes Mr L !</div>
            )}
          </div>
        </div>
        <div className="PartyInProgress-right-container">
          <h2>Liste de mots :</h2>
          {words.map((word, index) => {
            return <p key={index}>{word}</p>;
          })}
        </div>
      </div>
      {/* <div className="PartyInProgress_top_container">
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
      </div> */}
    </div>
  );
};

export default PartyInProgress;
