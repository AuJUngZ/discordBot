const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { MongoClient } = require("mongodb");
const { config } = require("dotenv");

config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cpe64")
    .setDescription("To find the friend infomation of CPE64")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The StudentID of the friend")
        .setRequired(true)
    ),
  async execute(interaction) {
    const StudentID = interaction.options.getString("id");
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect();
      const database = client.db("cpe64info");
      const collection = database.collection("cpe");
      const query = { id: StudentID };
      const result = await collection.findOne(query);
      if (result == null) {
        await interaction.reply({
          content: "This student ID does not exist",
          ephemeral: true,
        });
      } else {
        const embed = new EmbedBuilder()
          .setColor(randomColor())
          .setTitle(`Information of ${StudentID}`)
          .setAuthor({
            name: "CPE64 Friend Information",
            iconUrl: "https://i.imgur.com/8EoXZRz.png",
          })
          .setDescription(
            "🖥️ This is the information of the friend you are looking for 🖥️"
          )
          .setImage(await result.img)
          .setTimestamp()
          .setFooter({
            text: "❤️CPE64 Friend Information presented by AuJungZ❤️",
            iconUrl: "https://i.imgur.com/8EoXZRz.png",
          });
        await interaction.reply({ embeds: [embed] });
        //log
        console.table({
          command: "cpe64",
          user: interaction.user.username,
          "used time": new Date().toLocaleString("th-TH", {
            timeZone: "Asia/Bangkok",
          }),
        });
      }
    } catch (err) {
      console.log(err.stack);
    }
  },
};

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
