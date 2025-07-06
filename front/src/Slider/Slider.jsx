import React from "react";
import axios from "../api/axios";
import style from "./Slider.module.css";

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      isDragging: false,
      startX: 0,
      scrollLeft: 0,
      perView: 0,
    };

    this.containerRef = React.createRef();
    this.contentRef = React.createRef();
    this.timeoutId = null;
  }

  async componentDidMount() {
    try {
      const response = await axios.get("/hotmovies");
      this.setState({ movies: response.data.movies }, () => {
        this.calculatePerView();
        this.setupSlider();
      });
      window.addEventListener("resize", this.handleResize);
    } catch (error) {
      console.error("Greška pri učitavanju filmova", error);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    this.clearAutoPlayTimeout();

    const slider = this.contentRef.current;
    if (slider) {
      slider.removeEventListener("scroll", this.infiniteScroll);
      slider.removeEventListener("mousedown", this.dragStart);
      slider.removeEventListener("touchstart", this.dragStart);
      slider.removeEventListener("mousemove", this.dragging);
      slider.removeEventListener("touchmove", this.dragging);
    }

    document.removeEventListener("mouseup", this.dragStop);
    document.removeEventListener("touchend", this.dragStop);

    if (this.containerRef.current) {
      this.containerRef.current.removeEventListener(
        "mouseenter",
        this.clearAutoPlayTimeout
      );
      this.containerRef.current.removeEventListener(
        "mouseleave",
        this.autoPlay
      );
    }
  }

  handleResize = () => {
    this.calculatePerView();
    this.setupSlider();
  };

  calculatePerView = () => {
    const slider = this.contentRef.current;
    if (!slider || slider.children.length === 0) return;
    const firstCardWidth = slider.children[0].offsetWidth;
    const perView = Math.round(slider.offsetWidth / firstCardWidth) - 1;
    this.setState({ perView: perView > 0 ? perView : 0 });
  };

  setupSlider = () => {
    const slider = this.contentRef.current;
    const { perView } = this.state;
    if (!slider) return;

    const firstCardWidth = slider.children[0]?.offsetWidth || 0;
    slider.scrollLeft = firstCardWidth * perView;

    slider.addEventListener("scroll", this.infiniteScroll);
    slider.addEventListener("mousedown", this.dragStart);
    slider.addEventListener("touchstart", this.dragStart);
    slider.addEventListener("mousemove", this.dragging);
    slider.addEventListener("touchmove", this.dragging);

    document.addEventListener("mouseup", this.dragStop);
    document.addEventListener("touchend", this.dragStop);

    if (this.containerRef.current) {
      this.containerRef.current.addEventListener(
        "mouseenter",
        this.clearAutoPlayTimeout
      );
      this.containerRef.current.addEventListener("mouseleave", this.autoPlay);
    }

    this.autoPlay();
  };

  clearAutoPlayTimeout = () => {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  };

  scroll = (dir) => {
    const slider = this.contentRef.current;
    if (!slider) return;
    const cardWidth = slider.children[0]?.offsetWidth || 0;
    slider.scrollLeft += dir === "left" ? -cardWidth : cardWidth;
  };

  autoPlay = () => {
    if (window.innerWidth < 800) return;
    this.clearAutoPlayTimeout();
    this.timeoutId = setTimeout(() => {
      const slider = this.contentRef.current;
      if (!slider) return;
      const cardWidth = slider.children[0]?.offsetWidth || 0;
      slider.scrollLeft += cardWidth;
    }, 2500);
  };

  infiniteScroll = () => {
    const slider = this.contentRef.current;
    const { perView } = this.state;
    if (!slider) return;

    if (slider.scrollLeft === 0) {
      slider.classList.add(style["no-transition"]);
      slider.scrollLeft = slider.scrollWidth - 2 * slider.offsetWidth;
      setTimeout(() => slider.classList.remove(style["no-transition"]), 0);
    } else if (
      Math.ceil(slider.scrollLeft) ===
      slider.scrollWidth - slider.offsetWidth
    ) {
      slider.classList.add(style["no-transition"]);
      slider.scrollLeft = slider.offsetWidth;
      setTimeout(() => slider.classList.remove(style["no-transition"]), 0);
    }

    this.clearAutoPlayTimeout();
    if (!this.containerRef.current.matches(":hover")) this.autoPlay();
  };

  dragStart = (e) => {
    const pageX = e.pageX || (e.touches && e.touches[0].pageX);
    this.setState({
      isDragging: true,
      startX: pageX,
      scrollLeft: this.contentRef.current.scrollLeft,
    });
    this.contentRef.current.classList.add(style.dragging);
  };

  dragging = (e) => {
    if (!this.state.isDragging) return;
    e.preventDefault();
    const pageX = e.pageX || (e.touches && e.touches[0].pageX);
    const walk = pageX - this.state.startX;
    this.contentRef.current.scrollLeft = this.state.scrollLeft - walk;
  };

  dragStop = () => {
    this.setState({ isDragging: false });
    this.contentRef.current.classList.remove(style.dragging);
  };

  render() {
    const { movies, perView } = this.state;
    if (movies.length === 0) return null;

    const prependMovies = movies.slice(-perView);
    const appendMovies = movies.slice(0, perView);
    const loopedMovies = [...prependMovies, ...movies, ...appendMovies];

    return (
      <div className={style.sliderWrapper} ref={this.containerRef}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          id="left"
          className={style["slider-arrow-left"]}
          onClick={() => this.scroll("left")}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>

        <div className={`${style.slider} slider`} ref={this.contentRef}>
          {loopedMovies.map((movie, idx) => (
            <div
              className={`${style.card} card ${
                idx < perView || idx >= perView + movies.length
                  ? style.clone
                  : ""
              }`}
              key={`${movie.id}-${idx}`} // jedinstveni key za klonove
              onClick={() => this.props.showMovie(movie.id)}
            >
              <img src={movie.photo} alt={movie.title} />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          id="right"
          className={style["slider-arrow-right"]}
          onClick={() => this.scroll("right")}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    );
  }
}

export default Slider;
