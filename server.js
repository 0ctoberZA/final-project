const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { check, validationResult } = require("express-validator");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/login", (req, res) => {
  if (validLogin) {
    req.session.username = username;
    req.session.email = email;
    req.session.successfulLogin = true;
  } else {
    res.redirect("/login");
  }
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// connect to mysql
connection.connect((err) => {
  if (err) {
    console.error(" Error connecting to MySql: " + err.stack);
    return;
  }
  console.log(" Connected to MySql as id " + connection.threadId);
});

app.use(express.static(__dirname));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

//secure routes
const isAuthenticated = (req, res) => {
  if (req.session.successfulLogin) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const User = {
  tableName: "clients",
  createUser: function (newUser, callback) {
    connection.query(
      "INSERT INTO " + this.tableName + " SET ? ",
      newUser,
      callback
    );
  },
  getUserByEmail: function (email, callback) {
    connection.query(
      " SELECT * FROM " + this.tableName + " WHERE email = ? ",
      email,
      callback
    );
  },

  getUserByUsername: function (username, callback) {
    connection.query(
      " SELECT * FROM " + this.tableName + " WHERE username = ? ",
      username,
      callback
    );
  },
};

app.post(
  "/signup",
  [
    check("email").isEmail(),
    check("username").isAlphanumeric().withMessage("username"),

    check("email").custom(async (value) => {
      const user = await User.getUserByEmail(value);
      if (user) {
        throw new Error("Email already exists!");
      }
    }),
    check("username").custom(async (value) => {
      const user = await User.getUserByUsername(value);
      if (user) {
        throw new Error("Username already exists");
      }
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = {
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      full_name: req.body.full_name,
    };

    // insert user to mysql
    User.createUser(newUser, (error, results, fields) => {
      if (error) {
        console.error("Error inserting user: " + error.message);
        return res.status(500).json({ error: error.message });
      }
      console.log("Inserting a new user with id " + results.insertId);
      res.status(201).json(newUser);
    });
  }
);
// login route
app.post("/login", isAuthenticated, (req, res) => {
  const { username, password } = req.body;

  connection.query(
    " SELECT * FROM clients WHERE username = ? ",
    [username],
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        res.status(401).send("Wrong username or password");
      } else {
        const user = results[0];
        // compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            req.session.user = user;
            res.send("Login successful");
          } else {
            res.status(401).send("Wrong username or password");
          }
        });
      }
    }
  );
});

// logout route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/login");
    }
  });
});

// Service selection route
app.post("/select-services", (req, res) => {
  const { selectedServices } = req.body;
  const clientId = req.session.user.id;
});

// insert selected services into database
const sql = "INSERT INTO services (clients_Id, services_Id) VALUES ? ";
const values = selectedServices.map((servicesId) => [clientsId, servicesId]);
connection.query(sql, [values], (err, result) => {
  if (err) {
    console.error("Error inserting selected services:", err);
    res.status(500).send("Failed to select services");
  } else {
    res.status(200).send("Services selected successfully");
  }
});

// fetch selected service
app.get("/selected-services", (req, res) => {
  const clientsId = req.session.user.id;

  const sql =
    " SELECT * FROM services INNER JOIN user_services ON services.id = user_services.services_id WHERE user_services.user_id = ? ";
  connection.query(sql, [clientsId], (err, results) => {
    if (err) {
      console.error("Error fetching selected services:", err);
      res.status(500).send("Failed to fetch selected services");
    } else {
      res.status(200).json(results);
    }
  });
});

// retrieve services
app.get("/service/:id", (req, res) => {
  const servicesId = req.params.id;
  const sql = "SELECT * FROM services WHERE id = ? ";
  db.query(sql, [servicesId], (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

// start server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
