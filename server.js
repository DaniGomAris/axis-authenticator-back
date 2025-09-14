const app = require("./src/app");
const logger = require("./src/logger/logger");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // logger.info(`Running on http://localhost:${PORT}`);
  logger.info(`Server running on port ${PORT}`);
});
