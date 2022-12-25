const fs = require("fs");
const path = require("path");

function commandLoader(client) {
  const commandPath = path.join(process.cwd(), "commands");
  const commandFiles = scanDir(commandPath);
  //   console.log(commandFiles);

  for (const file of commandFiles) {
    const filePath = path.join(process.cwd(), file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
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

module.exports = commandLoader;
