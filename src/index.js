const MakeAuthService = require('./services/AuthService');

module.exports = (app) => {
  app.register('Service', 'AuthService', MakeAuthService);

  return app;
};
