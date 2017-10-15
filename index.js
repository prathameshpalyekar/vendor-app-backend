// ES6 fun...
require('babel-register');

process.env['APP_ROOT_PATH'] = process.cwd();
// Kick start the app
require('./app');
