import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";
import style from "./LoginRegistration.module.css";

class LoginRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
      name: "",
      email: "",
      password: "",
      file: null,
    };
  }

  toggleForm = () => {
    this.setState((prevState) => ({
      isLogin: !prevState.isLogin,
      name: "",
      email: "",
      password: "",
      file: null,
    }));
  };

  handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      this.setState({ file: files[0] });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { name, email, password, file, isLogin } = this.state;

      if (isLogin) {
        try {
          const response = await axios.post("/login", { email, password });

          if (response.data.token) {
            const token = response.data.token;
            localStorage.setItem("token", token);
            const decoded = jwtDecode(token);

            localStorage.setItem("userId", decoded.id);
            localStorage.setItem("userName", decoded.name);
            localStorage.setItem("userEmail", decoded.email);
            localStorage.setItem("userPhoto", decoded.photo);
            localStorage.setItem("isAdmin", decoded.isadmin);

            alert(response.data.message);
            window.location.href = "/home";
          } else {
            alert("Login neuspešan: Nema tokena.");
          }
        } catch (error) {
          console.error("Greška pri logovanju:", error);
        }
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (file) {
          formData.append("file", file);
        }

        const response = await axios.post("/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  render() {
    const { isLogin, name, email, password } = this.state;
    return (
      <div className={style.user}>
        <div className={style["content"]}>
          <form
            className={style["login-register-form"]}
            onSubmit={this.handleSubmit}
          >
            <h1>{isLogin ? "Dobrodošli" : "Postanite dio tima"}</h1>

            {!isLogin && (
              <input
                type="text"
                name="name"
                value={name}
                placeholder="Ime"
                onChange={this.handleChange}
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={this.handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Šifra"
              value={password}
              onChange={this.handleChange}
              required
            />

            {!isLogin && (
              <input type="file" name="file" onChange={this.handleChange} />
            )}

            <p className={style.switch}>
              {isLogin ? "Nemate nalog?" : "Već posjedujete nalog?"}
              <a onClick={this.toggleForm}>
                {isLogin ? "Registracija" : "Prijava"}
              </a>
            </p>
            <button className={style["sign-up-create-btn"]}>
              {isLogin ? "Prijava" : "Registracija"}
            </button>
          </form>

          <div className={style["social-icons"]}>
            <a href="#" className={style["icons"]}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className={style["icons"]}>
              <i className="fab fa-google-plus-g"></i>
            </a>
            <a href="#" className={style["icons"]}>
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className={style["icons"]}>
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginRegistration;
