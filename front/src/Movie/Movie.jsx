import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";
import AddToListModal from "../AddToListModal/AddToListModal";
import AddCriticModal from "../AddCriticModal/AddCriticModal";
import styles from "./Movie.module.css";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import MovieRating from "../MovieRating/MovieRating";
import { useNavigate } from "react-router-dom";

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCritic, setSelectedCritic] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const userID = +localStorage.getItem("userId");
  const userPhoto = localStorage.getItem("userPhoto");
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });

  const dynamicStyle = (movie) => {
    if (!movie?.backdrop) return {};

    const isHttp = movie.backdrop.startsWith("http");
    const url = isHttp
      ? movie.backdrop
      : `http://localhost:3001/public/movieBackdrop/${movie.backdrop}`;

    return {
      backgroundImage: `linear-gradient(to bottom, #000000dc, #000000dc), url("${url}")`,
      backgroundSize: "cover",
    };
  };

  const [userLists, setUserLists] = useState([]);
  const [critics, setCritics] = useState([]);
  const navigate = useNavigate();
  const [isListAddModalOpen, setIsListAddModalOpen] = useState(false);
  const [isCriticAddModalOpen, setIsCriticAddModalOpen] = useState(false);

  const openListAddModal = () => {
    setIsListAddModalOpen(true);
  };

  const closeListAddModal = () => {
    setIsListAddModalOpen(false);
  };

  const openCriticAddModal = () => {
    setIsCriticAddModalOpen(true);
  };

  const closeCriticAddModal = () => {
    setIsCriticAddModalOpen(false);
  };

  const handleAddToList = async (movieID, selectedList, listName) => {
    try {
      let listID = 0;
      if (listName) {
        const payload = {
          userID: userID,
          name: listName,
        };

        const response = await axios.post("/addlist", payload);
        listID = response.data.listID;
      } else {
        listID = selectedList;
      }

      const response2 = await axios.post(`/addtolist/${listID}`, { movieID });

      alert(response2.data.message);
    } catch (err) {
      alert("Greška pri dodavanju na listu.");
    }

    closeListAddModal();
  };

  const handleAddCritic = async (
    movieID,
    selectedCritic,
    criticName,
    rating
  ) => {
    try {
      let criticID = selectedCritic;
      if (criticName) {
        const response = await axios.post("/addcritic", { criticName });
        criticID = response.data.criticID;
      }

      const response2 = await axios.post(`/addcriticrating`, {
        criticID,
        movieID,
        rating,
      });

      alert(response2.data.message);
    } catch (err) {
      alert("Greška pri dodavanju kritike.");
    }

    closeListAddModal();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        movieID: movie.id,
        userID: userID,
      };

      const response = await axios.post("/addreview", payload);
      alert(response.data.message);

      const newReview = {
        ...formData,
        id: userID,
        name: localStorage.getItem("userName"),
        photo: userPhoto,
      };

      setMovie((prevMovie) => ({
        ...prevMovie,
        reviews: [newReview, ...(prevMovie.reviews || [])],
      }));

      setFormData({
        comment: "",
        rating: "",
      });
    } catch (error) {
      console.error("Greška pri slanju:", error);
    }
  };

  useEffect(() => {
    if (movie?.rating?.length) {
      setSelectedCritic(movie.rating[0].name);
      setSelectedRating(movie.rating[0].rating);
    } else {
      setSelectedCritic("");
      setSelectedRating(0);
    }
  }, [movie]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`/movie/${id}`);
        const response2 = await axios.get(`/userlists/${userID}`);
        const response3 = await axios.get(`/critics`);

        setMovie(response.data.movie);
        if (response2.data.lists) setUserLists(response2.data.lists);

        if (response3.data.critics) {
          const ratedCriticNames = response.data.movie.rating.map(
            (r) => r.name
          );

          const availableCritics = response3.data.critics.filter(
            (critic) => !ratedCriticNames.includes(critic.name)
          );

          setCritics(availableCritics);
        }
      } catch (err) {
        setError("Greška pri učitavanju filma.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    return `${dateObj.getDate()}. ${
      dateObj.getMonth() + 1
    }. ${dateObj.getFullYear()}.`;
  };

  function transformTrailerLink(movie) {
    const urlParts = movie.split("/");
    const trailerKey = urlParts[urlParts.length - 2];
    return `https://www.youtube.com/embed/${trailerKey}/?autoplay=1&mute=1&start=6&loop=1&playlist=${trailerKey}`;
  }

  const handleDeleteMovie = async (id) => {
    try {
      const response = await axios.delete(`/deletemovie/${id}`);

      alert(response.data.message);
      navigate("/");
    } catch (err) {
      alert("Gresaka pri vracanju korisnika!");
    }
  };
  const handleDeleteReview = async (reviewID) => {
    try {
      const response = await axios.delete(`/deletereview/${reviewID}`);

      setMovie((prevMovie) => ({
        ...prevMovie,
        reviews: (prevMovie.reviews || []).filter(
          (review) => review.reviewid !== reviewID
        ),
      }));

      alert(response.data.message);
    } catch (err) {
      alert("Greška pri brisanju komentara!");
    }
  };
  if (loading) return <p>Učitavanje filma...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>Film nije pronađen.</p>;

  return (
    <div className={styles["movie"]}>
      <Header />
      <div className={styles["modal"]} style={dynamicStyle(movie)}>
        <div className={styles["modal-poster"]}>
          <img
            src={
              movie.photo.startsWith("http")
                ? movie.photo
                : `http://localhost:3001/public/moviePhoto/${movie.photo}`
            }
          />
        </div>

        <div className={styles["modal-info"]}>
          <div className={styles["modal-title-rating-runtime"]}>
            <p className={styles["modal-title"]}>{movie.title}</p>
            {movie.rating && (
              <div className={styles["modal-rating"]}>
                <select
                  className={styles["modal-rating-select"]}
                  onChange={(e) => {
                    const critic = e.target.value;
                    setSelectedCritic(critic);
                    const rating = movie.rating.find((r) => r.name === critic);
                    setSelectedRating(rating.rating);
                  }}
                >
                  {movie.rating.map((rating) => (
                    <option key={rating.name} value={rating.name}>
                      {rating.name}
                    </option>
                  ))}
                </select>
                <span className={styles["rating"]}>{selectedRating}</span>
              </div>
            )}
            <p className={styles["modal-runtime"]}>{movie.runtime}min</p>
          </div>

          <p className={styles["modal-description"]}>{movie.description}</p>

          <div className={styles["modal-tags"]}>
            <p>Genres:</p>
            {movie?.genres?.map((genre) => (
              <p
                className={`${styles["modal-genre-tag"]} ${
                  styles[genre.label.toLowerCase()]
                    ? styles[genre.label.toLowerCase()]
                    : " "
                }`}
              >
                {genre.label}
              </p>
            ))}
          </div>

          <p className={styles["modal-popularity"]}>
            Popularity: &nbsp; {movie.popularity}
          </p>
          <p className={styles["modal-release-date"]}>
            Release date: &nbsp; {formatDate(movie.release_date)}
          </p>
        </div>

        <div className={styles["modal-trailer-buttons"]}>
          <div className={styles["modal-trailer"]}>
            <iframe
              src={transformTrailerLink(movie.trailer)}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className={styles["modal-trailer-iframe"]}
              title="City of God Trailer"
            ></iframe>
          </div>
          <div className={styles["modal-buttons"]}>
            {isAdmin && (
              <button
                onClick={openCriticAddModal}
                className={styles["modal-button"]}
              >
                Add critic
              </button>
            )}
            {isAdmin && (
              <button className={styles["modal-button"]}>
                <Link
                  to={`/editmovie/${movie.id}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Update
                </Link>
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => handleDeleteMovie(movie.id)}
                className={styles["modal-button"]}
              >
                Delete
              </button>
            )}
            <button
              onClick={openListAddModal}
              className={styles["modal-button"]}
            >
              Add to list
            </button>
          </div>
        </div>
        <AddToListModal
          isOpen={isListAddModalOpen}
          onClose={closeListAddModal}
          movieTitle={movie.title}
          movieID={movie.id}
          availableLists={userLists}
          onAdd={handleAddToList}
        />

        <AddCriticModal
          isOpen={isCriticAddModalOpen}
          onClose={closeCriticAddModal}
          movieTitle={movie.title}
          movieID={movie.id}
          availableCritics={critics}
          onAdd={handleAddCritic}
        />
      </div>
      <div className={styles["user-reviews"]}>
        <p className={styles["user-reviews-heading"]}>User reviews</p>

        <form onSubmit={handleSubmit} className={styles["comment-form"]}>
          <div className={styles["comment-rating-user"]}>
            <Link className={styles["nav-link-icon"]} to={`/user/${userID}`}>
              {!userPhoto || userPhoto == "null" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className={styles["user-icon"]}
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
                  className={styles["user-photo"]}
                  alt="User avatar"
                />
              )}
            </Link>
            <div className={styles["comment-rating-icon"]}>
              <ion-icon className={styles["star-icon"]} name="star"></ion-icon>
              <input
                type="number"
                className={styles["comment-rating"]}
                min="0"
                max="10"
                step="0.1"
                onChange={handleChange}
                name="rating"
                value={formData.rating}
              />
            </div>
          </div>

          <textarea
            className={styles["comment-text"]}
            placeholder="Leave your comment"
            rows={2}
            onChange={handleChange}
            name="comment"
            value={formData.comment}
            required
          />

          <button type="submit" className={styles["comment-submit"]}>
            Comment
          </button>
        </form>

        {movie?.reviews?.map((review) => (
          <div className={styles["review-card"]}>
            <div className={styles["user-info"]}>
              <Link
                className={styles["nav-link-icon"]}
                to={`/user/${review.id}`}
              >
                {!review.photo || review.photo == "null" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className={styles["user-icon"]}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
                  <img
                    src={`http://localhost:3001/public/userPhotos/${review.photo}`}
                    className={styles["user-photo"]}
                    alt="User avatar"
                  />
                )}
              </Link>
              <p className={styles["review-username"]}>{review.name}</p>
              <div className={styles["review-rating"]}>
                <MovieRating rating={review.rating} />
              </div>
              {(userID == review.id || isAdmin) && (
                <button
                  onClick={() => handleDeleteReview(review.reviewid)}
                  className={styles["comment-delete"]}
                >
                  Delete
                </button>
              )}
            </div>
            <p className={styles["review-text"]}>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movie;
