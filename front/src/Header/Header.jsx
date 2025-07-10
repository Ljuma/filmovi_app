import React from "react";
import axios from "../api/axios";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import style from "./Header.module.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userPhoto: null,
      isAdmin: false,
      userID: null,
    };
  }

  componentDidMount() {
    const userPhoto = localStorage.getItem("userPhoto");
    const userID = Number(localStorage.getItem("userId"));
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    this.setState({ userID, userPhoto, isAdmin });
  }

  render() {
    const { userID, userPhoto, isAdmin } = this.state;
    return (
      <header className={style["section-header"]}>
        <img className={style.logo} alt="logo soon" src="/logo.webp" />
        <nav className={style["main-nav"]}>
          <ul className={style["main-nav-list"]}>
            {isAdmin && (
              <li>
                <a className={style["nav-link"]} href="/addmovie">
                  Add Movie
                </a>
              </li>
            )}
            <li>
              <Link className={style["nav-link"]} to="/home">
                Home
              </Link>
            </li>
            <li>
              <Link className={style["nav-link"]} to="/movies">
                Movies
              </Link>
            </li>
            <li>
              <a className={style["nav-link"]} href="#">
                Gallery
              </a>
            </li>
            <li>
              <a className={style["nav-link"]} href="aboutUS2/index.html">
                About Us
              </a>
            </li>
            <li>
              <Link className={style["nav-link-icon"]} to={`/user/${userID}`}>
                {userPhoto == "null" && userPhoto ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className={style["user-icon"]}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
                  <img
                    src={`http://localhost:3001/public/userPhotos/${userPhoto}`}
                    className={style["user-photo"]}
                    alt="User avatar"
                  />
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
