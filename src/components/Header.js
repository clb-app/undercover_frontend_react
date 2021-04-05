import React from "react";

// import CSS
import "./Header.css";

const Header = ({ title, rightTitle }) => {
  return (
    <header className="Header">
      <h1 className="Header-title">{title}</h1>
      <h2 className="Header-rightTitle">{rightTitle}</h2>
    </header>
  );
};

export default Header;
