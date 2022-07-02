module.exports = {
  apps : [{
    name: "bot-do-clube-de-programacao",
    script: "./index.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
