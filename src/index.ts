import app from "./application/app.js";
import logger from "./application/logging.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logger.info(`Server running on PORT ${PORT}`);
});
