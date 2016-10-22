var irc = require("tmi.js");

var options = {
  options: {
    debug: true
  },
  connection: {
    random: "chat",
    reconnect: true
  },
  identity: {
	username: "username",
	password: "oauth:password"
  },
  channels: ["#paperbat"]
};

var client = new irc.client(options);
client.connect();

client.on("connected", function(address, port) {

  client.on("chat", function(channel, user, message, self)
  {
    if(channel == "#paperbat")
    {
      if(user.username == "Pbot")
      {
        if(message.startsWith("Thanks for the sub"))
        {
          client.say("paperbat", "pbatLove pbatLove pbatLove pbatLove ");
        }
      }
    }
  });

});
