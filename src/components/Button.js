import React from "react";

// import CSS
import "./Button.css";

const Button = ({ title, onClick, width, bgcColor }) => {
  return (
    <button onClick={onClick} style={{ width, backgroundColor: bgcColor }}>
      {title}
    </button>
  );
};

export default Button;
