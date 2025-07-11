import React from "react";
import { useNavigate } from "react-router-dom";

export function withNavigation(Component) {
  return function (props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}
