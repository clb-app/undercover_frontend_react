import React from "react";

const Input = ({ label, type, placeholder }) => {
  return (
    <div>
      <label>{label}</label>
      <input type={type} placeholder={placeholder} />
    </div>
  );
};

export default Input;
