const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("randomuser")
    .setDescription("Replies with a random user from the API"),
  async execute(interaction) {
    const res = await fetch("https://randomuser.me/api/").then((res) =>
      res.json()
    );
    const user = res.results[0];
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
          value: user.dob.date,
        }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
