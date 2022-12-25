// Require the necessary discord.js classes
const { config } = require("dotenv");
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
// const fs = require("node:fs");
// const path = require("node:path");
const loadCommand = require("./Handler/commands");
const loadEvent = require("./Handler/event");

config();
const token = process.env.TOKEN;

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
client.commands = new Collection();
loadCommand(client);
loadEvent(client);
// Log in to Discord with your client's token
client.login(token);
