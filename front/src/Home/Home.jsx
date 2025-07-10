import React from "react";
import axios from "../api/axios";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Slider from "../Slider/Slider";
import TopRated from "../TopRated/TopRated";

import style from "./Home.module.css";

import routerHelper from "../routerHelper";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      selectedItem: 4,
      trailer:
        "https://www.youtube.com/embed/bLvqoHBptjg/?autoplay=1&mute=1&loop=1",
      title: "Forrest Gump",
      description: `The history of the United States from the 1950s to the
       '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.`,
      genres: "Drama, History, Romance",
      releaseDate: "6.7.1994.",
      rating: 9.6,
    };
  }

  handleWatchMore = () => {
    const { navigate } = this.props;
    const movieId = this.state.selectedItem;
    if (movieId) {
      navigate(`/movie/${movieId}`);
    }
  };

  async componentDidMount() {
    try {
      const response = await axios.get("/allmovies");
      this.setState({ movies: response.data.movies });
      console.log(response.data.movies);
    } catch (error) {
      console.error("Greška pri učitavanju filmova", error);
    }
  }

  showMovie = async (id) => {
    this.setState({ selectedItem: id });
    try {
      const response = await axios.get(`/getmovie/${id}`);
      const movie = response.data.movie;

      const urlParts = movie.trailer.split("/");
      const trailerKey = urlParts[urlParts.length - 2];

      const date = movie.release_date;
      const dateObj = new Date(date);

      this.setState({
        trailer: `https://www.youtube.com/embed/${trailerKey}/?autoplay=1&mute=1&start=6&loop=1&playlist=${trailerKey}`,
        title: movie.title,
        description: movie.description,
        genres: movie.genres,
        releaseDate: `${dateObj.getDate()}. ${
          dateObj.getMonth() + 1
        }. ${dateObj.getFullYear()}.`,
        rating: movie.rating,
      });
    } catch (error) {
      console.error("Greška pri učitavanju filmova", error);
    }
  };

  render() {
    const { movies } = this.state;
    return (
      <div className={style.home}>
        <Header />

        <section className={style["section-hero"]}>
          <iframe
            className={style.trailer}
            id="header-iframe"
            src={this.state.trailer}
            allow="autoplay"
            title={this.state.title}
          ></iframe>

          <div className={`${style.container} ${style["movie-content"]}`}>
            <h1 className={style["movie-title"]}>{this.state.title}</h1>
            <p className={style["movie-description"]}>
              {this.state.description}
            </p>
            <div className={style["movie-details"]}>
              <p className={style["movie-tag"]}>Movie</p>
              <p className={style["movie-genre"]}>{this.state.genres}</p>
              <p className={style["release-date"]}>{this.state.releaseDate}</p>

              {this.state.rating !== null && (
                <p className={style["movie-rating"]}>
                  <span>IMDB</span>
                  <ion-icon name="star"></ion-icon>
                  {this.state.rating}
                </p>
              )}
            </div>

            <button
              onClick={this.handleWatchMore}
              className={style["btn-watch-more"]}
            >
              Watch more
            </button>
          </div>
          <Slider showMovie={this.showMovie} />
        </section>
        <TopRated showMovie={this.showMovie} />
        <div className={style["section-movies"]}>
          <p className={style["section-movies-heading"]}> Our Best Movies</p>

          {movies.map((movie) => (
            <Link
              className={style["nav-links"]}
              to={`/movie/${movie.id}`}
              key={movie.mvie_id}
            >
              <div className={style["movie-card"]}>
                <img
                  src={
                    movie.photo.startsWith("http")
                      ? movie.photo
                      : `http://localhost:3001/public/moviePhoto/${movie.photo}`
                  }
                />
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
        <Footer />
      </div>
    );
  }
}

export default routerHelper(Home);
