const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { connectDB } = require("../../functions/functions.js");

let hostChoice;
let opponentChoice;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rpscreate")
    .setDescription("Create a new game of rock paper scissors")
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The opponent to play against")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("The bet for the game")
        .setRequired(true)
    ),
  async execute(interaction) {
    //check the host have user data or not
    const client = await connectDB();
    const findUser = await client
      .db("user")
      .collection("userinfo")
      .findOne({ user: interaction.user.tag });
    if (findUser == null) {
      await interaction.reply({
        content:
          "You don't have user data. Please create your user data first. \n use this command to create your user data: **/createuser**",
        ephemeral: true,
      });
      return;
    }
    //check balance of host
    if (findUser.balance < interaction.options.getNumber("bet")) {
      await interaction.reply({
        content: "You don't have enough balance to bet.",
        ephemeral: true,
      });
      return;
    }
    //create chat that host and opponent can accept or decline the game
    const opponent = interaction.options.getUser("opponent");
    const bet = interaction.options.getNumber("bet");
    const embed = new EmbedBuilder()
      .setColor("#fff")
      .setTitle("Rock Paper Scissors")
      .setDescription(
        `You have been challenged to a game of rock paper scissors by **${interaction.user.tag}**. \n\n The bet is **${bet} coins**.`
      )
      .setFooter({
        text: "Rock Paper Scissors",
      });
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("accept")
          .setLabel("Accept")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("decline")
          .setLabel("Decline")
          .setStyle(ButtonStyle.Danger)
      )
      .toJSON();
    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
    const filter = (i) => i.user.id === opponent.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });
    collector.on("collect", async (i) => {
      if (i.customId === "accept") {
        //check the opponent have user data or not
        const findOpponent = await client
          .db("user")
          .collection("userinfo")
          .findOne({ user: opponent.tag });
        if (findOpponent == null) {
          //if opponent don't have user data edit the message and cancel the game
          await i.update({
            embeds: [
              embed.setDescription(
                `**${opponent.tag}** don't have user data. \n\n The game has been cancelled.\n
                Please create your user data first. \n use this command to create your user data: **/createuser**`
              ),
            ],
            components: [],
          });
          return;
        } else {
          //check balance of opponent
          if (findOpponent.balance < bet) {
            await i.update({
              embeds: [
                embed.setDescription(
                  `**${opponent.tag}** don't have enough balance to bet. \n\n The game has been cancelled.`
                ),
              ],
              components: [],
            });
            return;
          }

          //if opponent have user data edit the message and start the game
          const row1 = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId("rock")
                .setLabel("Rock")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("paper")
                .setLabel("Paper")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("scissors")
                .setLabel("Scissors")
                .setStyle(ButtonStyle.Primary)
            )
            .toJSON();
          await i.update({
            embeds: [
              embed.setDescription(
                `**${opponent.tag}** has accepted the challenge. \n\n The game has been started.
                \n**${interaction.user.tag}** choose your move. **Host select first.** \n\n **pls select in 15 sec!!**`
              ),
            ],
            components: [row1],
          });
          //create a new collector for host to choose
          const filter = (i) => i.user.id === interaction.user.id;
          const collector1 =
            interaction.channel.createMessageComponentCollector({
              filter,
              time: 15000,
            });
          collector1.on("collect", async (i) => {
            if (i.customId === "rock") {
              hostChoice = "rock";
            } else if (i.customId === "paper") {
              hostChoice = "paper";
            } else if (i.customId === "scissors") {
              hostChoice = "scissors";
            }
            await i.update({
              embeds: [
                embed.setDescription(
                  `Host has chosen. \n\n **${opponent.tag}** choose your move. **pls select in 15 sec!!**`
                ),
              ],
            });
            //create a new collector for opponent to choose
            const filter = (i) => i.user.id === opponent.id;
            const collector2 =
              interaction.channel.createMessageComponentCollector({
                filter,
                time: 15000,
              });
            collector2.on("collect", async (i) => {
              if (i.customId === "rock") {
                opponentChoice = "rock";
              } else if (i.customId === "paper") {
                opponentChoice = "paper";
              } else if (i.customId === "scissors") {
                opponentChoice = "scissors";
              }
              await i.update({
                embeds: [
                  embed.setDescription(
                    `Opponent has chosen. waiting for the result...`
                  ),
                ],
                components: [],
              });
            });
            //wait for opponent to choose
          });
          //check if host or opponent don't choose
          await collector1.on("end", async (collected) => {
            if (collected.size === 0) {
              await interaction.editReply({
                embeds: [
                  embed.setDescription(
                    `**Host didn't choose. \n The game has been cancelled.**`
                  ),
                ],
                components: [],
              });
            }
          });
        }
      } else if (i.customId === "decline") {
        //if opponent decline the challenge
        await i.update({
          embeds: [
            embed.setDescription(
              `**${opponent.tag}** has declined the challenge. \n\n The game has been cancelled.`
            ),
          ],
          components: [],
        });
      }
    });
  },
};

async function findWinner(hostChoice, opponentChoice) {
  if (hostChoice === opponentChoice) {
    return "draw";
  } else if (hostChoice === "rock") {
    if (opponentChoice === "paper") {
      return "opponent";
    } else {
      return "host";
    }
  } else if (hostChoice === "paper") {
    if (opponentChoice === "scissors") {
      return "opponent";
    } else {
      return "host";
    }
  } else if (hostChoice === "scissors") {
    if (opponentChoice === "rock") {
      return "opponent";
    } else {
      return "host";
    }
  }
}
