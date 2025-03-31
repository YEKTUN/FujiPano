const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("../model/authModel");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUsername = await Auth.findOne({ name });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await Auth.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (existingEmail && existingUsername) {
      return res
        .status(400)
        .json({ message: "Username and email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Auth.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!user) {
      return res.status(500).json({ message: "User not created" });
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Auth.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        membership: user.membership,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { register, login };
