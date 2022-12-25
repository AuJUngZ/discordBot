const { Events } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.table({
      "Bot Tag": client.user.tag,
      "Bot Status": client.user.presence.status,
      Ping: `${client.ws.ping}ms`,
    });
  },
};
