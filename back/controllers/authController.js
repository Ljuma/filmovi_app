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
    const photo = req.file ? `/public/userPhotos/${req.file.filename}` : null;

    if (await authRepository.findUserByEmail(email))
      return res.status(400).json({ message: "Email je zauzet!" });

    const hashed = await bcrypt.hash(password, 10); // korišćenje bcrypt sa 10 rundi :contentReference[oaicite:1]{index=1}

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

module.exports = { register, login };
