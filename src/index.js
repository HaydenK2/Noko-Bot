require("dotenv").config();
const {Client, IntentsBitField} = require('discord.js');
const emotes = (str) => str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);
requiredWords = ["shikanoko", "nokonoko", "koshitantan"];
requiredWordsJp = ["しかのこ", "のこのこ", "こしたんたん"];
JPFlag = false; //  flag that checks if you're saying the shikanoko phrase in chuncks using the japanese language
ENFlag = false; //  flag that checks if you're saying the shikanoko phrase in chuncks using the english language
chunkCounter = 0;    //  counter that keeps track of which shikanoko chunk phrase we are at 
canClap = false;    //  flag that checks if user can use the clap emoji
shikanokoCount = 0; //  counts the number of times Noko Bot sent the video

totalCounter = 0;   //  must say four times

// Intents = set of permissions to access set of events
//  ex. if have Guilds, will know if guild (aka server) is created, etc.
//  need to turn on priviliged getway intents on bot
const client = new Client({

    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});



//  Confirms if bot enters server for first time
client.on('guildCreate', (guild) => {
    guild.systemChannel.send( "ぬん!\n");
    guild.systemChannel.send({files: [{ attachment: 'static\\images\\Enter_Noko.gif' }]});
});

//  Confirms bot is online
client.on('ready', (cli) => {
    console.log(`${cli.user.tag} is online.`);
});

//  message listener
client.on('messageCreate', (message) => {
    // console.log(message);
    //  if message has bot property...
    if (message.author.bot) {
        return;
    }
    
    sentWords = message.content.toLowerCase();
    if (message.content === "👏") {
        
        if (canClap && totalCounter >= 3) {
            shikaMsg(message);
            totalCounter = 0;
            resetCounters();
        }  else if (canClap) {
            totalCounter++;
        }  else {
            resetCounters();
        }
    }   else if (message.content === "shikanoko nokonoko koshitantan 👏" || message.content === "しかのこのこのここしたんたん 👏") {
        canClap = true;
        if (canClap && totalCounter >= 3) {
            shikaMsg(message);
            totalCounter = 0;
            resetCounters();
        }  else {
            totalCounter++;
        }  

    } else if (message.content === "shikanoko nokonoko koshitantan" || message.content === "しかのこのこのここしたんたん") { 
        //  phrase must be said 4 times
        canClap = true;
        console.log("can now clap");
        
    }   else if (message.content === requiredWords[chunkCounter]) {
        

        //  if JPFlag is on then must reset
        if (JPFlag) {
            console.log("original Sequence started in JP! RESTART");
            resetCounters();
            return;
        }

        if (chunkCounter >= requiredWords.length - 1) {
            canClap = true;
            console.log("can now clap");
            chunkCounter = 0;
        }   else {
            chunkCounter++;
            console.log("increment chunkCounter: " + chunkCounter);
            ENFlag = true;
            console.log("Must continue sequence in jp!");
        }
    }   else if (message.content === requiredWordsJp[chunkCounter]){
        
        //  if ENFlag is on then must reset
        if (ENFlag) {
            console.log("original Sequence started in EN! RESTART");
            resetCounters();
            return;
        }

        if (chunkCounter >= requiredWords.length - 1) {
            canClap = true;
            console.log("can now clap");
            chunkCounter = 0;
        }   else {

            chunkCounter++;
            console.log("increment chunkCounter: " + chunkCounter);
            JPFlag = true;
            console.log("Must continue sequence in jp!");
        } 
        
    } else if (message.content.toLowerCase() === "!shikanoko'd") {
        message.channel.send("🦌🦌🦌ぬん! シカノコしたの" + shikanokoCount + "回! 🦌🦌🦌");
    } else {
        //  If these aren't consecutive, then we reset all counters
        // console.log("ERROR: WRONG SEQUENCE! RESTART!");
        resetCounters();
    }
})


/**
 * Resets all global vars
 */
function resetCounters() {
    chunkCounter = 0;
    totalCounter = 0;
    JPFlag = false;
    ENFlag = false;
    canClap = false;
}

/**
 * check if the totalCounter is at least 3
 * 
 * @param {*} message discord message
 */
function checkTotalCounter(message) {
    //  totalCounter Must be called four times
    if (totalCounter >= 3) {
        shikaMsg(message);
        totalCounter = 0;
    }  else {
        totalCounter++;
        console.log("increment total counter; it's now " + totalCounter);
    }   
}

/**
 * discord bot sends in a text message, a png, and a video link
 * 
 * @param {} message : this is how the discord bot will send a message to the discord server
 */
function shikaMsg(message) {
    //  https://stackoverflow.com/questions/69124819/send-an-image-using-discord-js
    message.channel.send( "ぬん.\n");
    message.channel.send({files: [{ attachment: 'static\\images\\NUN.jpg' }]});
    
    console.log("waiting");

    //  wait for about 1.5 seconds
    setTimeout(function(){
        console.log("reply message");
        //  maybe send a audio mp3? https://stackoverflow.com/questions/66037860/how-can-i-get-my-discord-bot-to-send-mp3-files-discord-py
        // message.channel.send({files: [{attachment: 'static\\audio\\ShikairoDays.mp3'}]});
        message.channel.send("https://www.youtube.com/watch?v=ZZvIVRQ4E7I");
    }, 1500);

    shikanokoCount+= 1;
}

client.login(process.env.TOKEN);
