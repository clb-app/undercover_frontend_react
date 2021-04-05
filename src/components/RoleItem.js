import React from "react";

// import CSS
import "./RoleItem.css";

const RoleItem = ({ value, role }) => {
  return (
    <div className="RoleItem">
      <div className="RoleItem-value">{value}</div>
      <div>{role}</div>
    </div>
  );
};

export default RoleItem;
