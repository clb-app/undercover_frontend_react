import React from "react";

// import CSS
import "./EnterPseudo.css";

// import des composants
import Input from "./Input";
import Button from "./Button";

const EnterPseudo = ({ setInput, onClick, isBtnLoading }) => {
  return (
    <div className="modal-container">
      <div className="modal">
        <Input
          label="On te connait pas encore, mets ton blaze"
          placeholder="What ever you want"
          setInput={setInput}
          type="text"
        />
        <Button
          title="Valider"
          onClick={onClick}
          width="200px"
          isLoading={isBtnLoading}
        />
      </div>
    </div>
  );
};

export default EnterPseudo;
