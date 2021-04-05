import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

// import CSS
import "./Header.css";

const Header = ({ title, rightTitle, back }) => {
  return (
    <header className="Header">
      {back && (
        <Link className="Header-back" to={back}>
          <FontAwesomeIcon icon="arrow-left" size="2x" color="#000" />
        </Link>
      )}
      <h1 className="Header-title">{title}</h1>
      <h2 className="Header-rightTitle">{rightTitle}</h2>
    </header>
  );
};

export default Header;
