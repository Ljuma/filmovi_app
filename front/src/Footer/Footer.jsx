import React from "react";
import axios from "../api/axios";
import style from "./Footer.module.css";
import routerHelper from "../routerHelper";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import { routerHelperID } from "../routerHelperID";

class Footer extends React.Component {
  render() {
    return (
      <div className={style["footer"]}>
        <img className={style.logo} alt="logo soon" src="/logo.webp" />
        <p className={style["copyright"]}>Copyright Luka Ljumovic</p>
        <p className={style["mail"]}>lukaljumovic.sa@gmaill.com (1/23)</p>
      </div>
    );
  }
}

export default routerHelper(routerHelperID(Footer));
