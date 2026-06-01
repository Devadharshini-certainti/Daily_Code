require('dotenv').config();

const app = require('./app');
const { connectDB, sequelize } = require('./config/database');
const { connectProducer, disconnectProducer } = require('./kafka/producer');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const EXTERNAL_PORT = process.env.EXTERNAL_PORT || 3003;

const start = async () => {
  await connectDB();
  await connectProducer();

  const server = app.listen(PORT, () => {
    logger.info(
`Order service running - internal:${PORT} external:${EXTERNAL_PORT}`
    );
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received  shutting down`);

 server.close(async ()=> {
      try {
await disconnectProducer();
    await sequelize.close();

    logger.info('Shutdown complete');
        process.exit(0);
      } catch (err) {
        logger.error('Shutdown error', err);
   process.exit(1);
      }
    });
  };
  process.on('SIGTERM',()=> shutdown('SIGTERM'));
 process.on('SIGINT',()=> shutdown('SIGINT'));
};

start().catch((err) => {
  logger.error('Failed start order service', err);
  process.exit(1);
});