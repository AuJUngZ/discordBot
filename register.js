const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const { config } = require("dotenv");
const path = require("node:path");

config();

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID.split(",");
console.log(guildId);
const commands = [];
function registerCommands() {
  const commandPath = path.join(process.cwd(), "commands");
  const commandFiles = scanDir(commandPath);

  for (const file of commandFiles) {
    const filePath = path.join(process.cwd(), file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(token);
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      let data = [];
      guildId.forEach(async (id) => {
        data = await rest.put(Routes.applicationGuildCommands(clientId, id), {
          body: commands,
        });
      });
      // const data = await rest.put(
      //   Routes.applicationGuildCommands(clientId, guildId),
      //   { body: commands }
      // );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  })();
}

function scanDir(dir) {
  let files = [];
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      files = files.concat(scanDir(filePath));
    } else if (file.endsWith(".js")) {
      files.push(path.relative(process.cwd(), filePath));
    }
  });
  return files;
}

module.exports = registerCommands;

// Grab all the command files from the commands directory you created earlier
// const commandFiles = fs
//   .readdirSync("./commands")
//   .filter((file) => file.endsWith(".js"));

// // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`);
//   commands.push(command.data.toJSON());
// }

// // Construct and prepare an instance of the REST module
// const rest = new REST({ version: "10" }).setToken(token);

// // and deploy your commands!
// (async () => {
//   try {
//     console.log(
//       `Started refreshing ${commands.length} application (/) commands.`
//     );

//     // The put method is used to fully refresh all commands in the guild with the current set
//     const data = await rest.put(
//       Routes.applicationGuildCommands(clientId, guildId),
//       { body: commands }
//     );

//     console.log(
//       `Successfully reloaded ${data.length} application (/) commands.`
//     );
//   } catch (error) {
//     // And of course, make sure you catch and log any errors!
//     console.error(error);
//   }
// })();
