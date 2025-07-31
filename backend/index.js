const server = require("./api/server");
const { LogStatus } = require("./data/enums");
const { logDDMessage } = require("./utils/logUtils");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logDDMessage(`Server started for Appliq`, LogStatus.INFO);
  console.log(`Server running on port ${PORT}`);
});
