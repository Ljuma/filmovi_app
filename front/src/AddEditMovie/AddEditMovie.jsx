import React from "react";
import axios from "../api/axios";
import style from "./AddEditMovie.module.css";
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

class AddEditMovie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movie: {
        title: "",
        description: "",
        backdrop: null,
        photo: null,
        photoPreview: null,
        backdropPreview: null,
        trailer: "",
        popularity: 0,
        release_date: "",
        runtime: 0,
        genres: [],
      },
      genres: [],
      mode: "add",
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const { movie, mode } = this.state;

    try {
      const formData = new FormData();
      formData.append("title", movie.title);
      formData.append("description", movie.description);
      formData.append(
        "trailer",
        this.processYouTubeUrl(this.state.movie.trailer)
      );
      formData.append("popularity", movie.popularity);
      formData.append("release_date", movie.release_date);
      formData.append("runtime", movie.runtime);

      if (movie.photo instanceof File) {
        formData.append("photo", movie.photo);
      }
      if (movie.backdrop instanceof File) {
        formData.append("backdrop", movie.backdrop);
      }

      const genresIds = movie.genres.map((g) => g.value);
      formData.append("genres", JSON.stringify(genresIds));

      let response;
      if (mode === "edit") {
        const id = this.props.params.id;
        response = await axios.put(`/editmovie/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.post("/addmovie", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert("Greška!");
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState((prevState) => ({
      movie: {
        ...prevState.movie,
        [name]: value,
      },
    }));
  };

  handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);

      this.setState((prevState) => ({
        movie: {
          ...prevState.movie,
          [name]: file,
          [`${name}Preview`]: previewUrl,
        },
      }));
    }
  };

  async componentDidMount() {
    const { id } = this.props.params;
    try {
      const response2 = await axios.get("/genres");
      this.setState({
        genres: response2.data.genres,
      });

      if (id) {
        const response = await axios.get(`/movie/${id}`);
        const movie = response.data.movie;

        movie.release_date = movie.release_date
          ? movie.release_date.slice(0, 10)
          : "";

        this.setState({
          movie: movie,
          mode: "edit",
        });
      }
    } catch (err) {
      alert("Greška pri učitavanju");
    }
  }

  handleGenresChange = (selectedOptions) => {
    this.setState((prevState) => ({
      movie: {
        ...prevState.movie,
        genres: selectedOptions || [],
      },
    }));
  };

  processYouTubeUrl = (url) => {
    try {
      if (url.includes("youtube.com/embed/")) {
        return url;
      }
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");

      if (!videoId) return "";

      return `https://www.youtube.com/embed/${videoId}/?autoplay=1&mute=1&start=6&loop=1&playlist=${videoId}`;
    } catch (err) {
      return "";
    }
  };
  render() {
    return (
      <div className={style["section-add-edit"]}>
        <Header />

        <div className={style["content"]}>
          {(this.state.movie.photoPreview ||
            typeof this.state.movie.photo === "string") && (
            <img
              src={
                this.state.movie.photoPreview
                  ? this.state.movie.photoPreview
                  : this.state.movie.photo
              }
              alt="Photo"
              className={style["photo-preview"]}
            />
          )}
          <form onSubmit={this.handleSubmit} className={style["movie-form"]}>
            <div className={style["form-component"]}>
              <label className={style["form-label"]} for="title">
                Title:
              </label>
              <input
                id="title"
                type="text"
                className={style["form-input"]}
                name="title"
                value={this.state.movie.title}
                onChange={this.handleChange}
              />
            </div>

            <div className={style["form-component"]}>
              <label className={style["form-label"]} for="decscription">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                rows="2"
                className={style["form-input"]}
                value={this.state.movie.description}
                onChange={this.handleChange}
              ></textarea>
            </div>

            <Select
              options={this.state.genres}
              isMulti
              name="genres"
              styles={customStyles}
              value={this.state.movie.genres}
              placeholder="Choose genres...."
              onChange={this.handleGenresChange}
            />

            <div className={style["form-component"]}>
              <label className={style["form-label"]} for="backdrop">
                Backdrop:
              </label>
              <input
                id="backdrop"
                type="file"
                className={style["form-input"]}
                name="backdrop"
                onChange={this.handleFileChange}
              />
            </div>

            <div className={style["form-component"]}>
              <label className={style["form-label"]} for="photo">
                Photo:
              </label>
              <input
                id="photo"
                type="file"
                className={style["form-input"]}
                name="photo"
                onChange={this.handleFileChange}
              />
            </div>

            <div className={style["form-component"]}>
              <label className={style["form-label"]} for="trailer">
                Trailer:
              </label>
              <input
                id="trailer"
                type="text"
                name="trailer"
                className={style["form-input"]}
                value={this.state.movie.trailer}
                onChange={this.handleChange}
              />
            </div>

            <div className={style["form-component"]}>
              <label className={style["form-label"]} for="popularity">
                Popularity:
              </label>
              <input
                id="popularity"
                min="0"
                step="0.01"
                type="number"
                className={`${style["form-input"]} ${style["input-number"]}`}
                name="popularity"
                value={this.state.movie.popularity}
                onChange={this.handleChange}
              />
            </div>

            <div className={style["form-component"]}>
              <label className={style["form-label"]} for="date">
                Date:
              </label>
              <input
                id="release_date"
                type="date"
                className={style["form-input"]}
                name="release_date"
                value={this.state.movie.release_date}
                onChange={this.handleChange}
              />
            </div>

            <div className={style["form-component"]}>
              <label className={style["form-label"]} for="runtime">
                Runtime:
              </label>
              <input
                id="runtime"
                min="0"
                step="1"
                type="number"
                name="runtime"
                className={`${style["form-input"]} ${style["input-number"]}`}
                value={this.state.movie.runtime}
                onChange={this.handleChange}
              />
            </div>

            <div className={style["button-wrapper"]}>
              <button type="submit" className={style["submit-button"]}>
                {this.state.mode === "edit" ? "Edit" : "Add"}
              </button>
            </div>
          </form>
          {(this.state.movie.trailer ||
            this.state.movie.backdropPreview ||
            typeof this.state.movie.backdrop === "string") && (
            <div className={style["backdrop-trailer-preview"]}>
              {this.state.movie.trailer && (
                <div style={{ marginBottom: "1rem" }}>
                  <iframe
                    width="100%"
                    height="315"
                    src={this.processYouTubeUrl(this.state.movie.trailer)}
                    title="Trailer"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {(this.state.movie.backdropPreview ||
                typeof this.state.movie.backdrop === "string") && (
                <img
                  src={
                    this.state.movie.backdropPreview
                      ? this.state.movie.backdropPreview
                      : this.state.movie.backdrop
                  }
                  alt="Photo"
                  className={style["backdrop-preview"]}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default routerHelper(routerHelperID(AddEditMovie));
