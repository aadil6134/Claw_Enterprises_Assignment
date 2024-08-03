const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const db = require("./database");
const {
  createUserTable,
  findUserByUsername,
  addUser,
} = require("./src/models/userModel");

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async (req, res) => {
  const result = await db.sql`
    USE DATABASE chinook.sqlite; 
    SELECT * FROM users`;
  res.json(result);
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await findUserByUsername(username);
    console.log(user);
    if (user.length === 0) {
      const dbResponse = await addUser(username, hashedPassword);
      // const newId = dbResponse.lastID;
      console.log(dbResponse.lastID);
      res.status(200).json({message: `New user created with ID: ${dbResponse.lastID}`});
    } else {
      res.status(400).json({ message: "User already exists" });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const dbUser = await findUserByUsername(username)
  console.log(dbUser[0].password);
  if (dbUser.length === 0) {
    res.status(400).json({ message: "Invalid user" });
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser[0].password);
    if (isPasswordMatched) {
      const payload = {username};
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      res.status(200).send({jwtToken});
    } else {
      res.status(400).json({ message: "Invalid password" });
    }
  }
});

createUserTable()
  .then(() => {
    console.log("User table created or already exists");
  })
  .catch((error) => {
    console.error("Error creating user table", error);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
