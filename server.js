require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');
const logger = require('./src/utils/logger'); 

const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'development';

// Applies schema changes safely in development mode without wiping data.
const syncOptions = environment === 'development' ? { alter: true } : {}; 

sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL Database connected successfully.');
    // Syncs the database dynamically based on NODE_ENV
    return sequelize.sync(syncOptions);
  })
  .then(() => {
    console.log(`✅ Database schema synced successfully. (alter: ${syncOptions.alter || false})`);
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${environment} mode.`);
    });

    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        sequelize.close().then(() => {
          console.log('Database connection closed');
          process.exit(0);
        });
      });
    });
  })
  .catch((error) => {
    console.error('❌ Unable to connect or sync the database:', error);
    process.exit(1);
  });