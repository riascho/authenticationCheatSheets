import express from "express";
import session from "express-session"; // https://expressjs.com/en/resources/middleware/session.html
import { Session } from "express-session";

interface CustomSession extends Session {
  test: string;
  authenticated: boolean;
  user: {
    username: string;
    password: string;
  };
}

const port = process.env.PORT || 3000;
const app = express();
const sess = {
  secret: "very-secret-key",
  resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request.
  saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store.
  store: new session.MemoryStore(),
  /** new session.MemoryStore() creates an in-memory session storage
   * When initialized, it creates a new instance of MemoryStore, Sessions are stored in a JavaScript object in the server's memory, Each session gets a unique ID (stored in the browser cookie)
   * The MemoryStore is primarily intended for development and testing purposes. For production applications, you should use a persistent store like Redis or MongoDB.
   */
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    secure: false, // if true requires HTTPS (doesn't work on localhost)
    httpOnly: true, // cookie is not accessible via JavaScript but only HTTP request
    sameSite: true, // CSRF protection
  },
  name: "sessionId", // name of the cookie used to store the session ID
};

app.use(session(sess)); //  When a request comes in: Express reads the session cookie. Uses the ID to look up session data in MemoryStore. Attaches the session to req.session

app.get("/", (req, res) => {
  (req.session as CustomSession).test = "Hello World!";
  console.log(req.session);
  res.send(req.session);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
