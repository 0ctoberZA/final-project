const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { check, validationResult } = require("express-validator");

const app = express();

app.get("/", function (req, res) {
  res.send(dirname + "/index.html");
});
