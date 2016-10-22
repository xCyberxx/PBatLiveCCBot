var irc = require("tmi.js");
var sleep  = require("sleep");
var fs = require("fs");

var readline = require("readline");

var CheatOptions = require("./Options.json");

var options = require("./user.json");

var thisEarnings = {
  SessionEarnings: 0
};

var NewOptions = {
  MinDelay: 0,
  MaxDelay: 10
};

function PCheatPrint(text)
{
  console.log("[PCheat] " + text);
}

function clearScreen()
{
  //console.log('\033[2J');
  var lines = process.stdout.getWindowSize()[1];
for(var i = 0; i < lines; i++) {
    console.log('\r\n');
}
}

function random (low, high) {
    return Math.random() * (high - low) + low;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
const rl = readline.createInterface({input: process.stdin,
output: process.stdout});
rl.setPrompt("PCheat>");
//readline.clearScreenDown();
//rl.prompt(true);

clearScreen();

console.log("-=-=-=PCheat=-=-=-");
console.log();
console.log("1. Run Bot");
console.log("2. Earnings");
console.log("3. Settings");
console.log("4. Quit");

console.log();



rl.question("PCheat>", (Selection) => {



if(Selection == 1)
{
  //console.log(CheatOptions);
  console.log('Running Bot...');
  sleep.sleep(1);
  clearScreen();


  var client = new irc.client(options);
  client.connect();

  client.on("connecting", function (address, port) {
      PCheatPrint("Connecting to irc-ws.chat.twitch.tv:80..");
      PCheatPrint("Authenticating to IRC..")
  });
  var Connected = false;

  client.on("connected", function(address, port) {
    PCheatPrint("Connected to server.")
    PCheatPrint("Joined " + options.channels);
    console.log();
    PCheatPrint("Min Delay: " + CheatOptions.MinDelay + " Seconds; Max Delay: " + CheatOptions.MaxDelay + " Seconds");
    Connected = true;

  });
  var lastEmojiCount = 0;
  client.on("chat", function(channel, user, message, self)
  {
    if(Connected)
    {
      PCheatPrint(user.username + ": " + message);
      if(channel == "#paperbat")
      {
        if(user.username == "pbot")
        {
          if(message.startsWith("Thanks for the sub"))
          {
            var min = parseInt(CheatOptions.MinDelay);
            var max = parseInt(CheatOptions.MaxDelay);
            //console.log(min);
            //console.log(max);
            var randelay = randomInt(min,max);
            PCheatPrint("Waiting " + randelay + " seconds..");
            sleep.sleep(randelay);
            // Min 3 Max 10 Emojiss'
            var ChatString = "";
            var EmojiCount = randomInt(3,10);
            while (EmojiCount == lastEmojiCount)
            {
              EmojiCount = randomInt(3,10);
            }

            for (var i = 0; i < EmojiCount; i++) {
              ChatString = ChatString + "pbatLove ";
            }
            lastEmojiCount = EmojiCount;

            

            client.say("paperbat", ChatString);

            var Earnings = require("./earnings.json");
            var TotalEarningInt = parseInt(Earnings.TotalProfit);
            Earnings.TotalProfit = TotalEarningInt + 50;
            fs.writeFile("./earnings.json", JSON.stringify(Earnings), 'utf8', function(){});

            thisEarnings.SessionEarnings += 50;

            PCheatPrint("pbatHit! You've earned " + thisEarnings.SessionEarnings + " cc this session!");
          }
        }
      }
  }
  });

}/// End Selection 1
else if(Selection == 2)
{
  var Earnings = require("./earnings.json");
  console.log("You've earned a total of " + Earnings.TotalProfit + " cc!");
  sleep.sleep(10);
  rl.close();
}
else if (Selection == 3)
{
  clearScreen();
  console.log("---Settings---");
  console.log();
  console.log("1. Change Response Delay");
  //console.log("2. Back");

  console.log();

  rl.question("PCheat>", (Selections) =>
{

if(Selections == 1)
{
  //var StringifiedJSON = JSON.stringify(options);
  //fs.writeFile('./Options.json', StringifiedJSON, 'utf8', function(){});
rl.question("Min. Delay?", (Min) => {
  NewOptions.MinDelay = Min;
  rl.question("Max Delay?", (Max) => {
    NewOptions.MaxDelay = Max;
    var OptionsString = JSON.stringify(NewOptions);
    fs.writeFile('./Options.json', OptionsString, 'utf8', function(){});
    console.log("Options Saved!");
    sleep.sleep(1);
    rl.close();
    // Return to Settings Menu
  })
});

}
else {
  console.log("Command Unrecognized.");
  sleep.sleep(1);
  rl.close();
}


});
}



else if(Selection == 4)
{
  console.log("Shutting Down...");
  sleep.sleep(1);
  rl.close();
}
else {
  console.log("Command Unrecognized.");
  sleep.sleep(1);
  rl.close();
}

});
