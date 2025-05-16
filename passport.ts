// This is a simple example of using Passport.js with TypeScript and Express.js
// launch with npx ts-node passport.ts

import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { db } from "./db";
declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      password: string;
    }
  }
}

const app = express();

app.use(passport.initialize()); // makes passport available in the app
app.use(passport.session()); // The session() middleware alters the request object and is able to attach a ‘user’ value that can be retrieved from the session id.

// This is where we define the strategy for authentication
passport.use(
  new LocalStrategy((username, password, done) => {
    // takes 3 parameters: user-provided username, user-provided password, and a callback function to complete authentication
    // it then tries to find the user in the database and checks if the password matches
    // then call done() with appropriate results
    db.users.findByUsername(username, (err: Error | null, user: any) => {
      // using a callback function to simulate async database lookup
      if (err) {
        return done(err);
      }
      if (!user || user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// determines what user data is stored in the session, called when authentication succeeds
// It converts a user object to a unique identifier (in this case, user.id) -> Only the user ID is saved in the session, not the entire user object
passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

// retrieves the complete user object from the database, called on every request with an authenticated session
// It takes the ID from the session and finds the corresponding user and attaches the full user object to the request as req.user
passport.deserializeUser((id, done) => {
  db.users.findById(id as string, function (err, user) {
    if (err) return done(err);
    done(null, user);
  });
});

app.get(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.send("Hello World!");
  }
);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

/**
 * To test this app:

  1. Install dependencies:
  npm install

  2. Run the passport.ts file with Node.js:
  npx ts-node passport.ts

  3. The server will start at http://localhost:3000
  4. Test authentication by:
    - Creating a simple HTML form to submit username/password to /login
    - Using tools like Postman or curl to make POST requests to /login
    - The test user credentials are { username: any_username, password: "helloWorld456" }

  The app is set up to authenticate users using the local strategy with Passport.js, though you'll need to implement routes for login and other protected
  resources if they're not already in passport.ts.
 */
