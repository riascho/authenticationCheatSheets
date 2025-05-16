export const db = {
  users: {
    findByUsername: (
      // this function does not return anything but rather calls the callback function with a provided user result
      username: string,
      callback: (err: Error | null, user?: any) => void
      // Simulate a database lookup
    ) => {
      setTimeout(() => {
        const user = { username: username, password: "helloWorld456" };
        callback(null, user);
      }, 2000);
    },

    findById: (
      id: string,
      callback: (err: Error | null, user?: any) => void
    ) => {
      setTimeout(() => {
        const user = {
          id: id,
          username: "testUser",
          password: "helloWorld456",
        };
        callback(null, user);
      }, 2000);
    },
  },
};
