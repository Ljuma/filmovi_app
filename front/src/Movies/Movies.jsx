import React from "react";
import axios from "../api/axios";
import style from "./Movies.module.css";
import routerHelper from "../routerHelper";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import { routerHelperID } from "../routerHelperID";
import Select from "react-select";

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#222",
    borderColor: "#06b6d4",
    boxShadow: state.isFocused ? "0 0 0 1px #06b6d4" : "none",
    borderRadius: 8,
    minHeight: 40,
    cursor: "pointer",
    color: "white",
    fontSize: 15,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#222",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#fff",
  }),
  input: (base) => ({
    ...base,
    color: "white",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#1595ac" : "#222",
    color: "#fff",
    fontSize: 15,
    cursor: "pointer",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#06b6d422",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#06b6d4",
    fontSize: 14,
    paddingRight: 3,
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#06b6d4",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#06b6d4",
      color: "#222",
    },
  }),
};

class Movies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      filteredMovies: [],
      genres: [],
      minYear: 0,
      maxYear: 0,
      minRuntime: 0,
      maxRuntime: 0,
      selectedMinYear: 0,
      selectedMaxYear: 0,
      selectedMinRuntime: 0,
      selectedMaxRuntime: 0,
    };
  }

  filterMovies = async () => {
    const {
      selectedMinYear,
      selectedMaxYear,
      selectedMinRuntime,
      selectedMaxRuntime,
      selectedGenres,
      selectedTitle,
    } = this.state;

    const genreValues = selectedGenres?.map((g) => g.value).join(",") || "";

    try {
      const response = await axios.get("/filtermovies", {
        params: {
          minYear: selectedMinYear,
          maxYear: selectedMaxYear,
          minRuntime: selectedMinRuntime,
          maxRuntime: selectedMaxRuntime,
          genres: genreValues,
          title: selectedTitle,
        },
      });
      this.setState({ movies: response.data.movies });
    } catch (error) {
      console.error("Greška pri filtriranju filmova", error);
    }
  };

  handleMinRuntimeChange = (e) => {
    const val = Number(e.target.value);
    if (val <= this.state.selectedMaxRuntime && val >= this.state.minRuntime) {
      this.setState({ selectedMinRuntime: val }, this.filterMovies);
    }
  };

  handleMaxRuntimeChange = (e) => {
    const val = Number(e.target.value);
    if (val >= this.state.selectedMinRuntime && val <= this.state.maxRuntime) {
      this.setState({ selectedMaxRuntime: val }, this.filterMovies);
    }
  };

  handleMinYearChange = (e) => {
    const val = Number(e.target.value);
    if (val <= this.state.selectedMaxYear && val >= this.state.minYear) {
      this.setState({ selectedMinYear: val }, this.filterMovies);
    }
  };

  handleMaxYearChange = (e) => {
    const val = Number(e.target.value);
    if (val >= this.state.selectedMinYear && val <= this.state.maxYear) {
      this.setState({ selectedMaxYear: val }, this.filterMovies);
    }
  };

  handleGenresChange = (selectedOptions) => {
    this.setState({ selectedGenres: selectedOptions || [] }, this.filterMovies);
  };

  handleTitleChange = (e) => {
    this.setState({ selectedTitle: e.target.value }, this.filterMovies);
  };

  async componentDidMount() {
    try {
      const response = await axios.get("/allmovies");
      const response2 = await axios.get("/genres");
      console.log(response.data.extremeValues);
      this.setState({
        movies: response.data.movies,
        genres: response2.data.genres,
        minYear: response.data.extremeValues.minyear,
        maxYear: response.data.extremeValues.maxyear,
        minRuntime: response.data.extremeValues.minruntime,
        maxRuntime: response.data.extremeValues.maxruntime,
        selectedMinYear: response.data.extremeValues.minyear,
        selectedMaxYear: response.data.extremeValues.maxyear,
        selectedMinRuntime: response.data.extremeValues.minruntime,
        selectedMaxRuntime: response.data.extremeValues.maxruntime,
      });
    } catch (error) {
      console.error("Greška pri učitavanju filmova", error);
    }
  }

  render() {
    const { movies, genres } = this.state;
    return (
      <div className={style["section-search"]}>
        <Header />
        <div className={style["content"]}>
          <div className={style["filters"]}>
            <form className={style["filter-form"]}>
              <div className={style["form-row"]}>
                <div className={style["form-component"]}>
                  <label className={style["filter-label"]} for="title">
                    Title
                  </label>
                  <input
                    type="text"
                    className={style["filter-input"]}
                    id="title"
                    onChange={this.handleTitleChange}
                  />
                </div>

                <div className={style["form-component"]}>
                  <Select
                    options={genres}
                    isMulti
                    styles={customStyles}
                    placeholder="Choose genres...."
                    onChange={this.handleGenresChange}
                  />
                </div>
              </div>
              <div className={style["form-row"]}>
                <div className={style["form-component"]}>
                  <label className={style["filter-label"]} for="minruntime">
                    Runtime
                  </label>
                  <input
                    type="number"
                    min={this.state.minRuntime}
                    max={this.state.selectedMaxRuntime}
                    value={this.state.selectedMinRuntime}
                    onChange={this.handleMinRuntimeChange}
                    className={` ${style["filter-input"]} ${style["input-number"]} `}
                    id="minruntime"
                  />
                  <label className={style["filter-label"]} for="maxruntime">
                    to
                  </label>
                  <input
                    type="number"
                    min={this.state.selectedMinRuntime}
                    max={this.state.maxRuntime}
                    value={this.state.selectedMaxRuntime}
                    onChange={this.handleMaxRuntimeChange}
                    className={` ${style["filter-input"]} ${style["input-number"]} `}
                    id="maxruntime"
                  />
                </div>

                <div className={style["form-component"]}>
                  <label className={style["filter-label"]} for="minyear">
                    Year
                  </label>
                  <input
                    type="number"
                    min={this.state.minYear}
                    max={this.state.selectedMaxYear}
                    value={this.state.selectedMinYear}
                    onChange={this.handleMinYearChange}
                    className={` ${style["filter-input"]} ${style["input-number"]} `}
                    id="minyear"
                  />
                  <label className={style["filter-label"]} for="maxyear">
                    to
                  </label>
                  <input
                    min={this.state.selectedMinYear}
                    max={this.state.maxYear}
                    value={this.state.selectedMaxYear}
                    onChange={this.handleMaxYearChange}
                    type="number"
                    className={` ${style["filter-input"]} ${style["input-number"]} `}
                    id="maxyear"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className={style["movies"]}>
            {movies.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                className={style["nav-links"]}
                key={movie.movie_id}
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
        </div>
      </div>
    );
  }
}

export default routerHelper(routerHelperID(Movies));
