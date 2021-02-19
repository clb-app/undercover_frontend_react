import React from "react";

const Input = ({ label, type, placeholder, setInput }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};

export default Input;
