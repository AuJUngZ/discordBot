const fs = require("fs");
const path = require("path");

function eventLoadder(client) {
  const eventPath = path.join(process.cwd(), "events");
  const eventFiles = scanDir(eventPath);

  for (const file of eventFiles) {
    const filePath = path.join(process.cwd(), file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
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

module.exports = eventLoadder;
