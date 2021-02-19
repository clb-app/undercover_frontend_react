import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// import CSS
import "./Home.css";

// import des composants
import Button from "../components/Button";
import EnterPseudo from "../components/EnterPseudo";

const Home = ({ setNewUser, token }) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [input, setInput] = useState("");
  const [page, setPage] = useState("");

  const history = useHistory();

  const handleNewParty = () => {
    if (!token) {
      setIsNewUser(true);
      setPage("/new");
    } else {
      history.push("/new");
    }
  };

  const handleJoinParty = () => {
    if (!token) {
      setIsNewUser(true);
      setPage("/join");
    } else {
      history.push("/join");
    }
  };

  const handleNewUser = () => {
    if (input.length > 0) {
      setNewUser(input);
    }

    history.push(page);
  };

  return (
    <div className="Home">
      <h2>Let's go</h2>
      <Button
        title="Tu veux créer une partie? C'est ici!"
        onClick={handleNewParty}
      />
      <Button
        title="Tu veux rejoindre une partie? C'est ici!"
        onClick={handleJoinParty}
      />
      {isNewUser && <EnterPseudo setInput={setInput} onClick={handleNewUser} />}
    </div>
  );
};

export default Home;
