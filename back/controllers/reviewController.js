const reviewRepository = require("./../repositories/reviewRepository");
const db = require("../config/db-config");

const addReview = async (req, res) => {
  try {
    const { movieID, rating, comment, userID } = req.body;

    let c = {};
    c.userID = userID;
    c.movieID = movieID;
    c.rating = rating;
    c.comment = comment;

    const results = await reviewRepository.insertReview(c);

    res.status(200).json({ message: "Uspjesno dodvanje." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri dodavanju." });
  }
};

const deleteReview = async (req, res) => {
  try {
    const id = req.params.id;

    const results = await reviewRepository.deleteReview(id);

    res.status(200).json({ message: "Uspjesno brisanje." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri brisanju." });
  }
};

module.exports = { addReview, deleteReview };
