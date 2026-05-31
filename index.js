const fs = require("fs");
const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
let lobbyF = false;
let bot;

console.clear();
console.log("6b6t bot by Carlox\nhttps://github.com/CarloxCoC/SpamBot\nv1.2\n");

const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

function isInLobby() {
  if (!bot || !bot.game || bot.game.difficulty != "hard") {
    if (!lobbyF) leaveLobby();
    return true;
  } else {
    return false;
  }
}

// leave the lobby
async function leaveLobby() {
  lobbyF = true;

  bot.controlState.forward = true;
  await bot.waitForTicks(40);
  bot.controlState.forward = false;

  while (bot?.game?.difficulty != "hard") {
    bot.controlState.back = true;
    await bot.waitForTicks(20);
    bot.controlState.back = false;

    bot.controlState.forward = true;
    await bot.waitForTicks(30);
    bot.controlState.forward = false;
  }

  lobbyF = false;
}
 Sadece bunuda yapıştır
const main = () => {
  bot = mineflayer.createBot({
    host: "6b6t.org",
    username: config.username || "VuadasTpaBot1",
    version: "1.21.4",
    skipValidation: true,
  });

  bot.once("login", async () => {
    bot.chat(`/login ${config.password}`);
  });

  bot.on("error", (err) => {
    console.log(err);
    logMessageToFile(`Error: ${err}`);
    bot.end();
  });

  bot.on("chat", (message, username) => {
    if (message === '!command') {
      bot.chat('command');
    }
  });

  bot.on("messagestr", (message) => {
    console.log(message);
    logMessageToFile(message);
  });

  bot.on("message", (message) => {
    const messageString = message.toString();
    console.log(messageString);

    for (const user of config.whitelist) {
      if (messageString === `${user} wants to teleport to you.`) {
        console.log(color.green + `${user} wants to teleport to you.` + color.reset);
        bot.chat(`/tpy ${user}`);
      }
    }
  });

  bot.on("kicked", (err) => {
    console.log(err);
    bot.end();
  });

  bot.on("end", () => {
    bot.removeAllListeners();
    setTimeout(main, 5000);
  });
};

main();
