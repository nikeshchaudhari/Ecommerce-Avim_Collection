const http = require("http");
const app = require("./app");

const server = http.createServer(app);
const dbConn = require("./config/db");
server.listen(3000, () => {
  console.log("Server is running...");
});
