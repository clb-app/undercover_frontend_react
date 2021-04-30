import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import uid2 from "uid2";

// import CSS
import "./JoinParty.css";

// import des composants
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import EnterPseudo from "../components/EnterPseudo";

const JoinParty = ({ player, api, setPlayerToken }) => {
  const [code, setCode] = useState("");
  const [isPlayerUnknown, setIsPlayerUnknown] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [isPseudoBtnLoading, setIsPseudoBtnLoading] = useState(false);

  const history = useHistory();

  const handleSubmit = async () => {
    setIsSubmitBtnLoading(true);
    if (!player) {
      setIsPlayerUnknown(true);
    } else {
      try {
        const response = await axios.get(`${api}/party/join?code=${code}`, {
          headers: {
            authorization: `Bearer ${player.token}`,
          },
        });

        if (response.status === 200) {
          history.push(`/partie/${code}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmitWithPseudo = async () => {
    setIsPseudoBtnLoading(true);
    if (nickname.length > 1) {
      const token = uid2(16);

      try {
        const response = await axios.get(
          `${api}/party/join?code=${code}&nickname=${nickname}`,
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
    }
  };

  return (
    <div className="JoinParty">
      <Header title="Rejoindre" rightTitle="Imposteur" back="/jouer" />
      <div className="wrapper">
        <Input
          label="Entre le code de ta partie"
          placeholder="Ex: 925921"
          setInput={setCode}
        />
        <div className="JoinParty-btn-container">
          <Button
            title="Valider"
            onClick={handleSubmit}
            isLoading={isSubmitBtnLoading}
          />
        </div>
      </div>
      {isPlayerUnknown && (
        <EnterPseudo
          setInput={setNickname}
          onClick={handleSubmitWithPseudo}
          isBtnLoading={isPseudoBtnLoading}
        />
      )}
    </div>
  );
};

export default JoinParty;
