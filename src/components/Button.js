import React from "react";
import Loader from "react-loader-spinner";

// import CSS
import "./Button.css";

const Button = ({
  title,
  onClick,
  width,
  bgcColor = "var(--blue)",
  color = "#fff",
  borderColor,
  isLoading,
}) => {
  return (
    <button
      onClick={onClick}
      style={{ width, backgroundColor: bgcColor, color, borderColor }}
      disabled={isLoading}
    >
      {title}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            backgroundColor: bgcColor,
            top: 0,
            width: "100%",
            left: 0,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
          }}
        >
          <Loader type="ThreeDots" color={color} height={25} width={60} />
        </div>
      )}
    </button>
  );
};

export default Button;
