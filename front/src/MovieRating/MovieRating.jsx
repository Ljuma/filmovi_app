import React from "react";

const StarFull = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#155e75"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Full star"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const StarHalf = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Half star"
  >
    <defs>
      <linearGradient id="halfGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="50%" stopColor="#155e75" />
        <stop offset="50%" stopColor="#333" />
      </linearGradient>
    </defs>
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      fill="url(#halfGrad)"
      stroke="#155e75"
      strokeWidth="1"
    />
  </svg>
);

const StarEmpty = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#333"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Empty star"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const Star = ({ type }) => {
  if (type === "full") return <StarFull />;
  if (type === "half") return <StarHalf />;
  return <StarEmpty />;
};

const StarsRating = ({ rating }) => {
  const starsCount = 5;
  const starRating = rating / 2;
  const stars = [];

  const roundedRating = Math.round(starRating * 2) / 2;

  for (let i = 1; i <= starsCount; i++) {
    if (roundedRating >= i) {
      stars.push(<Star key={i} type="full" />);
    } else if (roundedRating + 0.5 === i) {
      stars.push(<Star key={i} type="half" />);
    } else {
      stars.push(<Star key={i} type="empty" />);
    }
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex" }}>{stars}</div>
    </div>
  );
};

export default StarsRating;
