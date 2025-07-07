import React from "react";
import axios from "../api/axios";
import style from "./Movies.module.css";
import routerHelper from "../routerHelper";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import { routerHelperID } from "../routerHelperID";

class Movies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      filteredMovies: [],
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get("/allmovies");
      this.setState({ movies: response.data.movies });
      console.log(response.data.movies);
    } catch (error) {
      console.error("Greška pri učitavanju filmova", error);
    }
  }

  render() {
    const { movies } = this.state;
    return (
      <div className={style["section-search"]}>
        <Header />
        <div className={style["content"]}>
          <div className={style["filters"]}></div>

          <div className={style["movies"]}>
            {movies.map((movie) => (
              <Link to={`/movie/${movie.movie_id}`} key={movie.mvie_id}>
                <div className={style["movie-card"]}>
                  <img src={movie.photo} />
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default routerHelper(routerHelperID(Movies));
