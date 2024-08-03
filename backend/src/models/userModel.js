// src/models/userModel.js
const db = require("../../database");

const createUserTable = async () => {
  await db.run(`USE DATABASE chinook.sqlite;
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
};

const addUser = async (username, password) => {
  const response = await db.sql`USE DATABASE chinook.sqlite; INSERT INTO 'users' (username, password) VALUES (${username}, ${password})`;
  return response;
};

const findUserByUsername = async (username) => {
  const user = await db.sql`USE DATABASE chinook.sqlite; SELECT * FROM 'users' WHERE username = ${username}`
  return user;
};

module.exports = { createUserTable, addUser, findUserByUsername };
