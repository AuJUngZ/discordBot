const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteractionOptionResolver,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("randomuser")
    .setDescription("Replies with a random user from the API"),
  async execute(interaction) {
    const res = await fetch("https://randomuser.me/api/").then((res) =>
      res.json()
    );
    const user = res.results[0];
    const fixDate = (user) => {
      const date = user.dob.date;
      const canUseDate = date.split("T")[0];
      return canUseDate;
    };
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Random User")
      .setDescription(`Here is your random user!`)
      .setThumbnail(user.picture.large)
      .addFields(
        {
          name: "Name",
          value: `${user.name.title} ${user.name.first} ${user.name.last}`,
        },
        {
          name: "Email",
          value: user.email,
        },
        {
          name: "Phone",
          value: user.phone,
        },
        {
          name: "Location",
          value: `${user.location.city}, ${user.location.state}`,
        },
        {
          name: "Date of Birth",
          value: fixDate(user),
        }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });

    // Log the command usage to the console
    console.table({
      "Command Name": "randomuser",
      "Command author": interaction.user.tag,
      "Command Channel": interaction.channel.name,
      "Time Used": new Date().toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
        hour12: false,
      }),
    });
  },
};
