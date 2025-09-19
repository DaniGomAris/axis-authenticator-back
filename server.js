const app = require("./src/app");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Running on http://localhost:${PORT}`);
  logger.info(`Server running on port ${PORT}`);
});
