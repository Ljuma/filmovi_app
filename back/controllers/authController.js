const authRepository = require("./../repositories/authRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await authRepository.findUserByEmail(email);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Korisnik sa unijetim emailom ne postoji!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Pogrešna šifra." });
    }

    let adminResp = await authRepository.findAdminById(user.id);
    let isadmin = adminResp.rowCount == 0 ? false : true;

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        isadmin,
      },
      process.env.JWT_SECRET || "testserverkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Uspješno logovanje.",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri logovanju." });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (await authRepository.findUserByEmail(email))
      return res.status(400).json({ message: "Email je zauzet!" });

    const hashed = await bcrypt.hash(password, 10);

    let u = {};
    u.name = name;
    u.password = hashed;
    u.email = email;
    u.photo = photo;

    const results = await authRepository.insertUser(u);

    res.status(200).json({ message: "Uspjesna registracija." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri registraciji." });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    let user = await authRepository.getUser(id);

    user.lists = await authRepository.getUserLists(id);

    user.listCount = await authRepository.getUserListCount(id);

    user.numOfReviews = await authRepository.getUserNumOfReviews(id);

    user.avgReview = await authRepository.getUserAvgReview(id);

    console.log(user);

    res
      .status(200)
      .json({ message: "Uspjesno uzimanje korisnika.", user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri uzimanju." });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    let responnse = await authRepository.deleteUser(id);

    res.status(200).json({ message: "Uspjesno brisanje korisnika." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri brisanju." });
  }
};

const restoreUser = async (req, res) => {
  const { id } = req.params;
  try {
    let responnse = await authRepository.restoreUser(id);

    res.status(200).json({ message: "Uspjesno vracanje korisnika." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri vracanju." });
  }
};

const userLists = async (req, res) => {
  const { id } = req.params;
  try {
    let lists = await authRepository.getUserLists(id);

    res
      .status(200)
      .json({ message: "Uspjesno vracanje lista od korisnika.", lists: lists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri vracanju." });
  }
};

module.exports = {
  register,
  login,
  getUser,
  deleteUser,
  restoreUser,
  userLists,
};
