const { Events } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`
    * ********************************************* *
      Bot is online! Logged in as ${client.user.tag}
    * ********************************************* *
    `);
  },
};
