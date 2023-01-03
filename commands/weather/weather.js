const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Get the weather of a city")
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("The city to get weather for")
        .setRequired(true)
    ),
  async execute(interaction) {
    const city = interaction.options.getString("city");
    const weather = await getWeather(city);
    const embed = new EmbedBuilder()
      .setColor(randomColor())
      .setTitle(`Weather for ${city}`)
      .addFields(
        { name: "Temperature", value: `${weather.main.temp}°C`, inline: true },
        {
          name: "Feels Like",
          value: `${weather.main.feels_like}°C`,
          inline: true,
        },
        { name: "Humidity", value: `${weather.main.humidity}%`, inline: true },
        { name: "Wind Speed", value: `${weather.wind.speed}m/s`, inline: true },
        { name: "Clouds", value: `${weather.clouds.all}%`, inline: true },
        { name: "Weather", value: `${weather.weather[0].main}`, inline: true }
      )
      .setThumbnail(
        "https://media.discordapp.net/attachments/890602518235729930/1058000479080173578/CPE_LOGO.png"
      )
      .setImage(
        "https://images.unsplash.com/photo-1496450681664-3df85efbd29f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};

async function getWeather(city) {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d395b87047d2667cd34a4ee1396a199d&units=metric`
  );
  return res.data;
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
