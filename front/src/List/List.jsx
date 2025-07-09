import React from "react";
import axios from "../api/axios";
import style from "./List.module.css";
import routerHelper from "../routerHelper";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import { routerHelperID } from "../routerHelperID";
import Select from "react-select";

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      count: 0,
      list: {},
      listID: 0,
      activeUser: 0,
    };
  }

  async componentDidMount() {
    try {
      let { id } = this.props.params;
      const response = await axios.get(`/list/${id}`);

      this.setState({
        listID: id,
        movies: response.data.movies,
        count: response.data.movies.length,
        list: response.data.list,
        activeUser: Number(localStorage.getItem("userId")),
      });
    } catch (error) {
      console.error("Greška pri učitavanju filmova", error);
    }
  }

  handleDeleteFromList = async (movieID) => {
    try {
      const response = await axios.delete(
        `/deletefromlist/${this.state.list.id}`,
        {
          data: { movieID },
        }
      );
      alert(response.data.message);

      this.setState((prevState) => ({
        movies: prevState.movies.filter((movie) => movie.movie_id !== movieID),
        count: prevState.count - 1,
      }));
    } catch (err) {
      alert("Greška pri brisanju sa liste.");
    }
  };

  render() {
    const { movies } = this.state;
    return (
      <div className={style["section-list"]}>
        <Header />

        <div className={style["content"]}>
          <div className={style["list-details"]}>
            <p className={style["list-name"]}>{this.state.list.name}</p>
            <p className={style["list-count"]}>{this.state.count}</p>
          </div>

          <div className={style["movies"]}>
            {movies.map((movie) => (
              <div className={style["movie-card"]}>
                <Link
                  to={`/movie/${movie.movie_id}`}
                  className={style["nav-links"]}
                  key={movie.movie_id}
                >
                  <img src={movie.photo} />
                </Link>
                <p className={style["movie-base-title"]}>{movie.title}</p>
                <div className={style["movie-base-details"]}>
                  <p className={style["movie-base-year"]}>
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                  <p className={style["movie-base-rating"]}>
                    <ion-icon name="star"></ion-icon>
                    {movie.rating}
                  </p>
                </div>

                {this.state.list.user_id == this.state.activeUser && (
                  <button
                    onClick={() => this.handleDeleteFromList(movie.movie_id)}
                    className={style["delete-button"]}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default routerHelper(routerHelperID(List));
