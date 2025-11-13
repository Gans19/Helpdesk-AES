const app = require('./app');
const config = require('./config/config');

app.listen(config.port, () => {
  console.log(`🚀 HelpDesk Lite API running on port ${config.port}`);
});

