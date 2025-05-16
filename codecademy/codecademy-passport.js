// What strategies are and how to use a local strategy to authenticate users with a username and password.
// How to configure the local strategy as middleware in passport.
// How to manage persistent logins using serializeUser() and deserializeUser().
// How to use the passport.authenticate() middleware for login endpoints.
// How to log out a user through the logout() function that’s exposed in the request object.

const express = require("express");
const app = express();
const session = require("express-session");
const store = new session.MemoryStore();
const db = require("./db");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "f4z4gs$Gcg",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// using callback for async operation
// passport.deserializeUser((id, done) => {
//   db.users.findById(id, function (err, user) {
//     if (err) {
//       return done(err);
//     }
//     done(null, user);
//   });
// });

passport.deserializeUser(async (id, done) => {
  try {
    // Look up user id in database.
    await db.users.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(function (username, password, cb) {
    db.users.findByUsername(username, function (err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  })
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await db.users.createUser({ username, password });

    res.status(201).json({ msg: "New user created!", newUser });
  } catch (err) {
    res.status(500).json({ msg: "Error creating user!" });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("profile");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redicrect("/login");
});

app.get("/profile", (req, res) => {
  // Pass user object stored in session to the view page:
  res.render("profile", { user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
