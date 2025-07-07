import React from "react";
import axios from "../api/axios";
import style from "./UserProfile.module.css";
import routerHelper from "../routerHelper";
import Header from "../Header/Header";
import { routerHelperID } from "../routerHelperID";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false,
      userID: null,
      activeUserID: null,
      user: null,
    };
  }

  async componentWillMount() {
    let { id } = this.props.params;
    id = +id;

    const activeUserID = Number(localStorage.getItem("userId"));
    const isAdmin = localStorage.getItem("isAdmin") == "true";

    try {
      const response = await axios.get(`/user/${id}`);
      this.setState({
        user: response.data.user,
        activeUserID: activeUserID,
        userID: id,
        isAdmin: isAdmin,
      });
      console.log(response.data.message);
    } catch (err) {
      alert("Gresaka pri uzimanju korisnika!");
    }
  }

  handleDelete = async () => {
    try {
      const response = await axios.put(`/deleteuser/${this.state.user.id}`);

      alert(response.data.message);

      this.setState((prevState) => ({
        user: {
          ...prevState.user,
          deleted_at: new Date().toISOString(),
        },
      }));
    } catch (err) {
      alert("Gresaka pri brisanju korisnika!");
    }
  };

  handleRestore = async () => {
    try {
      const response = await axios.put(`/restoreuser/${this.state.user.id}`);

      alert(response.data.message);

      this.setState((prevState) => ({
        user: {
          ...prevState.user,
          deleted_at: null,
        },
      }));
    } catch (err) {
      alert("Gresaka pri vracanju korisnika!");
    }
  };

  handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhoto");
    localStorage.removeItem("token");
    this.props.navigate("/login");
  };

  render() {
    const { user, isAdmin, activeUserID } = this.state;

    if (user)
      return (
        <div class Name={style["user-profile-section"]} ref={this.containerRef}>
          <Header />
          <div className={style["main-content"]}>
            <div className={style["user-profile"]}>
              <div className={style["user-info"]}>
                {!user.photo ? (
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
                    src={`http://localhost:3001/public/userPhotos/${user.photo}`}
                    className={style["user-photo"]}
                    alt="User avatar"
                  />
                )}
                <div className={style["user-name-email"]}>
                  <p className={style["user-name"]}>{user.name}</p>
                  <p className={style["user-email"]}>{user.email}</p>
                </div>
              </div>
              <div className={style["user-buttons"]}>
                {user.id == activeUserID && (
                  <button
                    onClick={this.handleLogout}
                    className={style["user-button"]}
                  >
                    Logout
                  </button>
                )}

                {isAdmin &&
                  user.id != activeUserID &&
                  (user.deleted_at ? (
                    <button
                      onClick={this.handleRestore}
                      className={style["user-button"]}
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      onClick={this.handleDelete}
                      className={style["user-button"]}
                    >
                      Delete
                    </button>
                  ))}
              </div>
            </div>

            <div className={style["stats-container"]}>
              <div className={style["stat-box"]}>
                <div className={style["stat-number"]}>{user.numOfReviews}+</div>
                <div className={style["stat-label"]}>reviews</div>
              </div>
              <div className={style["stat-box"]}>
                <div className={style["stat-number"]}>{user.listCount}</div>
                <div className={style["stat-label"]}>lists</div>
              </div>
              <div className={style["stat-box"]}>
                <div className={style["stat-number"]}>
                  {Number(user.avgReview).toFixed(2)}
                </div>
                <div className={style["stat-label"]}>average rating</div>
              </div>
            </div>

            <div className={style["lists-container"]}>
              {user?.lists?.map((list) => {
                <div className={style["list-card"]}>
                  <p className={style["list-name"]}>{list.name}</p>
                  <p className={style["list-number"]}>{list.list_size}</p>
                </div>;
              })}
            </div>
          </div>
        </div>
      );
  }
}

export default routerHelper(routerHelperID(UserProfile));
