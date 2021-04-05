import React from "react";

// import CSS
import "./Button.css";

const Button = ({
  title,
  onClick,
  width,
  bgcColor = "var(--blue)",
  color = "#fff",
  borderColor,
}) => {
  return (
    <button
      onClick={onClick}
      style={{ width, backgroundColor: bgcColor, color, borderColor }}
    >
      {title}
    </button>
  );
};

export default Button;
