const {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription(
      "Dlete a specificd number of messsages from a channel or from a user"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to delete")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to delete messages from")
        .setRequired(false)
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    //check if the user has permission to use this command
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      return interaction.reply({
        content: "You do not have permission to use this command",
        ephemeral: true,
      });
    }
    const { channel, options } = interaction;
    const Amount = options.getNumber("amount");
    const Target = options.getUser("target");

    const Messages = await channel.messages.fetch();
    const Respon = new EmbedBuilder().setColor("#F50B94");

    if (Target) {
      let i = 0;
      const filtered = [];
      (await Messages).filter((m) => {
        if (m.author.id === Target.id && Amount > i) {
          filtered.push(m);
          i++;
        }
      });

      await channel.bulkDelete(filtered, true).then((messages) => {
        Respon.setDescription(
          `🗑️ Deleted ${messages.size} messages from ${Target.tag}`
        );
        interaction.reply({ embeds: [Respon] });
      });
    } else {
      await channel.bulkDelete(Amount, true).then((messages) => {
        Respon.setDescription(
          `🗑️ Deleted ${messages.size} messages from ${channel.name}`
        );
        interaction.reply({ embeds: [Respon] });
      });
    }
    // Log the command usage to the console
    console.table({
      UsedCommand: interaction.commandName,
      User: interaction.user.tag,
      Channel: interaction.channel.name,
    });
  },
};
