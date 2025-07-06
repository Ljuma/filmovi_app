import React from "react";
import axios from "../api/axios";
import style from "./TopRated.module.css";

class TopRated extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      isDragging: false,
      startX: 0,
      scrollLeft: 0,
    };

    this.containerRef = React.createRef();
    this.contentRef = React.createRef();
    this.timeoutId = null;
  }

  async componentDidMount() {
    try {
      const response = await axios.get("/topratedmovies");
      this.setState({ movies: response.data.movies });
    } catch (error) {
      console.error("Greška pri učitavanju filmova", error);
    }
  }

  render() {
    const { movies } = this.state;

    return (
      <div className={style["section-top-rated"]} ref={this.containerRef}>
        {movies.map((movie) => (
          <div
            className={style["top-rated"]}
            key={movie.id}
            onClick={() => this.props.showMovie(movie.id)}
          >
            <img src={movie.photo} alt={movie.title} />
          </div>
        ))}
      </div>
    );
  }
}

export default TopRated;
