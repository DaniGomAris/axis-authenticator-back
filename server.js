require("module-alias/register");
const app = require("@root/app");
const logger = require("@utils/logger");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Running on http://localhost:${PORT}`);
  logger.info(`Server running on port ${PORT}`);
});
