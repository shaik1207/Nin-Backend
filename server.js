require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'development';

const syncOptions =
  environment === 'development'
    ? { alter: true }
    : { alter: false };

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully.');

    await sequelize.sync(syncOptions);
    console.log(
      `✅ Database schema synced successfully. (alter: ${syncOptions.alter})`
    );

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(
        `🚀 Server running on port ${PORT} in ${environment} mode.`
      );
    });

    process.on('SIGTERM', async () => {
      console.log('🛑 SIGTERM received. Shutting down...');

      server.close(async () => {
        await sequelize.close();
        console.log('✅ Database connection closed.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Startup Error:', error);
    process.exit(1);
  }
}

startServer();