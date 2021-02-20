import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

// import CSS
import "./JoinParty.css";

// import des composants
import Input from "../components/Input";
import Button from "../components/Button";
import EnterPseudo from "../components/EnterPseudo";

const JoinParty = ({ player, api }) => {
  const [code, setCode] = useState("");
  const [isPlayerUnknown, setIsPlayerUnknown] = useState(false);

  const history = useHistory();

  const handleSubmit = async () => {
    if (!player) {
      setIsPlayerUnknown(true);
    } else {
      try {
        const response = await axios.get(`${api}/party/join`, {
          player_id: player._id,
          code,
        });

        if (response.status === 200) {
          history.push(`/party/${code}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="JoinParty">
      <Input
        label="Entres le code de ta partie"
        placeholder="Ex: 925921"
        setInput={setCode}
      />
      <Button title="Valider" onClick={handleSubmit} />
      {isPlayerUnknown && <EnterPseudo />}
    </div>
  );
};

export default JoinParty;
