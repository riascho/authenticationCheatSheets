const fs = require("fs");

export function findUser(users, email) {
  return users.find((user) => user.email === email);
}

export function writeJSONFile(filename, users) {
  fs.writeFile(filename, JSON.stringify(users), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("File has been written successfully");
    }
  });
}
