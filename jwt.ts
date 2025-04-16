import jwt, { JsonWebTokenError } from "jsonwebtoken";

const JWT_SECRET = "some_secret";
interface UserData {
  id: number;
  username: string;
  role: string;
}

function generateToken(userdata: UserData): string {
  return jwt.sign(userdata, JWT_SECRET);
}

function verifyToken(token: string): UserData | undefined {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as UserData;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      console.error("Invalid token", error.message);
    }
  }
}

const someUser: UserData = { id: 1234, username: "Jon890", role: "member" };

console.log(generateToken(someUser));
console.log(
  verifyToken(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNCwidXNlcm5hbWUiOiJKb244OTAiLCJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNzQ0Nzg2MzAzfQ.8oOP6Yqtum4FLX0ug4tmhCp0ltcv6FZtS8-BvhNYMbc"
  )
); // { id: 1234, username: 'Jon890', role: 'member', iat: 1744786303 } -> the iat claim (issued at) is the timestamp when the token was generated in Unix time
console.log(verifyToken("invalid token"));
