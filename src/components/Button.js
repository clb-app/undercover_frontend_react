import React from "react";

// import CSS
import "./Button.css";

const Button = ({ title, onClick, width }) => {
  return (
    <button onClick={onClick} style={{ width }}>
      {title}
    </button>
  );
};

export default Button;
