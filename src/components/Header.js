import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

// import CSS
import "./Header.css";

const Header = ({ title, rightTitle, back, setReload }) => {
  const history = useHistory();

  const handleClick = () => {
    if (back === "/") {
      console.log("handleClick back");
      setReload(true);
    }
    history.push(back);
  };

  return (
    <header className="Header">
      {back && (
        <div className="Header-back" to={back} onClick={handleClick}>
          <FontAwesomeIcon icon="arrow-left" size="2x" color="#000" />
        </div>
      )}
      <h1 className="Header-title">{title}</h1>
      <h2 className="Header-rightTitle">{rightTitle}</h2>
    </header>
  );
};

export default Header;
