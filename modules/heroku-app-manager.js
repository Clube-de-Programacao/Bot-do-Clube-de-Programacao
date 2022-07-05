const { heroku, name } = require("./index.js");

function restartHerokuApp() {
    heroku.apps(name).dynos().restartAll();
}