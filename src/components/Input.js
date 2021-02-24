import React from "react";

// import CSS
import "./Input.css";

const Input = ({ label, type, placeholder, setInput }) => {
  return (
    <div className="Input">
      <label className="Input-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        className="Input-input"
      />
    </div>
  );
};

export default Input;
