import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { db } from "./db.ts";

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
