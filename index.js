//https://discord.js.org/#/docs/discord.js/stable/general/welcome
//https://discordjs.guide/voice/
//https://www.npmjs.com/package/discord-together
//https://codesandbox.io/s/6ebuh?file=/commands/play.js

const Discord = require("discord.js");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    getVoiceConnection,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus, 
        } = require('@discordjs/voice');
//const commands = require('./commands/AA_commands.js')
//import {commands} from "./commands/AA_commands.js";
const { DiscordTogether } = require('discord-together');
const ytdl = require("ytdl-core");

//const { Client, MessageEmbed } = require('discord.js');
const config = require("./config.json");

const { Client, Intents } = require('discord.js');
//const { commands } = require("./commands/AA_commands");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES] });
const player = createAudioPlayer();

client.discordTogether = new DiscordTogether(client);
//const client = new Discord.Client();
const prefix = "§";
login();


function login() {
    client.login(config.BOT_TOKEN);

}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: "online",  //You can show online, idle....
        activity: {
            name: 'dir nicht',
            type: 'LISTENING' //PLAYING, STREAMING, LISTENING, WATCHING, COMPETING, (CUSTOM_STATUS)
        }
    });
    console.log("Status ist gesetzt");
    console.log("READY to RUMBLE");
});

client.on("messageCreate", function (message) {
    if (message.author.bot) return; //Wenn die Nachricht vom BOT ist, einfach ignorieren
    if (!message.content.startsWith(prefix)) return; //Prüfen nach Präfix
    var messageSlice = message.content.slice(prefix.length);
    const commandBody = (messageSlice[0] == prefix) ? debbugging(message, messageSlice) : messageSlice; //bei doppeltem Präfix gibs nem weiteren Debbugging Screen
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    process.stdout.write(`${message.author.tag} in "${message.guild.name}": `); // logging wer einen Befehl geschrieben hat
    //console.log(`${message.author.tag} in "${message.guild.name}": `); // logging wer einen Befehl geschrieben hat

           if (command === "help"){
               Hilfe(message);
               return;
    } else if (command === "ping") {                //Einfacher BOT Ping
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! Die Nachricht hat ${timeTaken}ms zu mir gebraucht.`)
        .then(() => console.log(`PING: ${timeTaken}ms`));
        return;
    } else if (command === "avatar") {              //Avatar anzeigen lassen
        message.channel.send(message.author.displayAvatarURL())
            .then(() => console.log(`Avatar angezeigt`));
        return;
    } else if (command === "id") {                  //Eigene ID anzeigen
        message.reply(`Deine ID ist ${message.author.id}`)
            .then(() => console.log(`ID: ${message.author.id}`));
        return;
    } else if (command === "tag") {                 //Anzeige des eigenen tags
        message.reply(`Dein TAG ist ${message.author.tag}`)
            .then(() => console.log(`TAG: ${message.author.tag}`));
        return;
    } else if (command === "username") {            //Anzeige des eingenen USERNAME
        message.reply(`Dein USERNAME ist ${message.author.username}`)
            .then(() => console.log(`Username: ${message.author.username}`));
        return;
    } else if (commandBody == "wer ist der beste?") { //kleiner Troll
        message.channel.send("<@496964617663414272>, natürlich");
        return;
    } else if (command === "embed") {               //TEST für eine embed message
        const embed = new MessageEmbed()
            .setTitle('A slick little embed')
            .setColor(0xff0000)
            .setDescription('Hello, this is a slick embed!');
        message.channel.send(embed)
            .then(() => console.log("Embed Nachricht"));
        return;
    } else if (command === "ranking") {             //Ein Ranking ausgeben lassen   ____WIP 5%
        process.stdout.write("Ranking ");
        ranking(message, args);
        return;
    } else if (command === "changepp") {            //ProfilBild soll geändert werden
        changeProfilePicture(message);
        return;
    } else if (command === "reset") {               //BOT neustarten
        resetBot(message.channel);
        message.reply("hier bin ich wieder :D");
        return;
    } else if (command === "forcestop") {           //BOT komplett stoppen
        message.channel.send("ich stoppe mich dann mal")
            .then(() => stopBot(message.channel));
        return;
    } else if (command === "spam") {                //andere Leute zu spammen (Troll)  ____WIP 5%
        spam(message, args);
        return;
    } else if (command === "join") {                //einem VC beitreten
        joinVC(message);
        return;
    } else if (command === "quit") {                //einen VC verlassen
        quitVC(message);
        return;
    } else if (command === "play") {                //Musik abspielen
        playMusic(message,args);
        return;
    } else if (command === "pause") {               //Musik anhalten
        pauseMusic(message);
        return;
    } else if (command === "stop") {                //Musik komplett stoppen
        stopMusic(message);
        return;
    } else if (command === "d2g") {                //Musik komplett stoppen
        discordTogether(message,args);
        return;
    } 
    message.reply(`Ich kenne diesen Befehl nicht`)
        .then(() => console.log(`unbekannter Befehl: ${command} + ${args}`));
});

function Hilfe(message) {
    message.channel.send(`Hallo ich bin ein BOT der von Lars (Telinnor) programmiert wird :)`)
    message.channel.send(`Ich bin aktuell nur zum debuggen zuständig..`)
    message.channel.send(`Es gibt bisher folgene Befehle:`)
        .then(() => console.log(`Hilfeseite`));
    message.channel.send(`ping, avatar, id, tag, username, help`);
}

function debbugging(message, commandBody) {
    newCommandBody = commandBody.slice(prefix.length);
    const args = newCommandBody.split(' ');
    const command = args.shift().toLowerCase();
    console.log("args: " + args);
    console.log("command: " + command);
    console.log(`attachments: ${message.attachments}`);
    return newCommandBody;
}

function ranking(message, args) { //WIP (Ranking erstellen)
    if (args == '') {
        message.reply(`Ich habe hierfür noch keine Hilfe eingerichtet, aber ohne ein Argument habe ich keine Ahnung was ich tuen soll :)`)
            .then(() => console.log(`Error`));
        return;
    }

    if (args == `messages`) {   //Hier soll man die 3 Leute sehen mit den meist geschriebenen Nachrichten
        //noch in der Entwicklung
        console.log("Messages");
        message.channel.send("Ich schau mal was ich da tuen kann. Kleinen Moment...");
    } else if (args = `rythm`) {     //Hier soll man die 3 Leute mit den meisten Interaktion mit "Rythm" sehen
        //noch in der Entwicklung
        console.log("Rythm");

    }

}

function changeProfilePicture(message) { // Profilbild ändern
    if (message.attachments.size == 0) {
        message.reply("es wurde kein Bild gesendet. Sorry");
        return;
    } else if (message.attachments.size > 1) {
        message.reply("es wurden mehrere Medien gesendet. Ich kann mich nicht entscheiden :(");
        return;
    }
    //console.log(message.attachments);
    mediaURL = message.attachments.entries().next().value[1].url;
    //console.log(message.attachments);
    console.log(mediaURL);
    client.user.setAvatar(mediaURL)
        .then(() => console.log(`New avatar set!: ${mediaURL}`))
        .catch(console.error);
    resetBot(message.channel);
    message.channel.send("mein Avater wurde angepasst");
    message.channel.send("Danke für diesen neuen Look");
}

function resetBot(channel) { //neustart des BOTs
    console.log("Ressetting...");
    //channel.send('Resetting...')
    stopBot(channel);
    login();
}

function stopBot(channel) { //Bot herunterfahren
    console.log("Stopping...");
    client.destroy()
}

function spam(message, args) {

    if (args[0] == undefined) {
        message.reply("Also ich brauch schon nen Namen den man nerven kann");
        console.log("spam kein Name vorhanden");
    }



}

async function joinVC(message) {
    const channel = message.member?.voice.channel;
    if (channel) {
        /**
         * The user is in a voice channel, try to connect.
         */
        try {
            const connection = await connectToChannel(channel);
            //connection.subscribe(player);
            await message.reply("verbunden...");
            await console.log(`Mit dem VC ${channel.name} verbunden`);
        } catch (error) {
            /**
             * Unable to connect to the voice channel within 30 seconds :(
             */
            console.error(error);
        }
    } else {
        /**
         * The user is not in a voice channel.
         */
        void message.reply('Bitte gehe erst in einen VC um den Command zu nutzen!');
    }
}

async function quitVC(message){
    connection = getVoiceConnection(message.guild.id); 
    if (typeof connection == "undefined") {
        joinVC(message);
        connection = getVoiceConnection(message.guild.id); 
    }
    connection.destroy();
    console.log("leave VC");
}

async function connectToChannel(channel) {
    /**
     * Here, we try to establish a connection to a voice channel. If we're already connected
     * to this voice channel, @discordjs/voice will just return the existing connection for us!
     */
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        //adapterCreator: createDiscordJSAdapter(channel),
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    /**
     * If we're dealing with a connection that isn't yet Ready, we can set a reasonable
     * time limit before giving up. In this example, we give the voice connection 30 seconds
     * to enter the ready state before giving up.
     */
    try {
        /**
         * Allow ourselves 30 seconds to join the voice channel. If we do not join within then,
         * an error is thrown.
         */
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        /**
         * At this point, the voice connection is ready within 30 seconds! This means we can
         * start playing audio in the voice channel. We return the connection so it can be
         * used by the caller.
         */
        return connection;
    } catch (error) {
        /**
         * At this point, the voice connection has not entered the Ready state. We should make
         * sure to destroy it, and propagate the error by throwing it, so that the calling function
         * is aware that we failed to connect to the channel.
         */
        connection.destroy();
        console.error(error);
        throw error;
    }
}

function getValidConnection (message){
    const connection = getVoiceConnection(message.guild.id);
    if (typeof connection == "undefined") {
        joinVC(message);
        return getVoiceConnection(message.guild.id);
    }
    return connection
}
async function playMusic(message,args) {
    const connection=getValidConnection(message);
    if(entersState(player, AudioPlayerStatus.Playing, 1e3)){
        player.stop();
    }
    if (player._state.status == "paused" || player._state.status == "autopaused"){
        player.unpause();
        message.reply("Musik wird weitergespielt");
        console.log("unpaused");
        return;
    }

    /*
     * We specify an arbitrary inputType. This means that we aren't too sure what the format of
     * the input is, and that we'd like to have this converted into a format we can use. If we
     * were using an Ogg or WebM source, then we could change this value. However, for now we
     * will leave this as arbitrary.
     */
    if (typeof args[0] == "undefined"){
        console.log("no argument at play");
        //musicURL ="https://rr3---sn-4g5ednds.googlevideo.com/videoplayback?expire=1642646635&ei=C3joYaLACpid1wKNpo_oCg&ip=178.254.2.91&id=o-AIVW15aDKKe6GqJdGttI1v0UK5e8dIIb6DEPaVNpthvZ&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&ns=NgVZn4LESWOAh8cAtwAyVkYG&gir=yes&clen=31056947&ratebypass=yes&dur=420.257&lmt=1641435242814494&fexp=24001373,24007246&c=WEB&txp=5530434&n=ROeq54TLUhpUKw&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRgIhALusiepuNQ7ff5_7LXCE2ZpsIgzgp1oaev_HrZUiJyb_AiEAn47WrLZ6-fmVEx2DEWjzcMoLigkeO-1MqX9yLpVOU-Y%3D&redirect_counter=1&rm=sn-5hnes77s&req_id=68e5bfc02e10a3ee&cms_redirect=yes&ipbypass=yes&mh=gf&mip=178.19.88.189&mm=31&mn=sn-4g5ednds&ms=au&mt=1642625098&mv=m&mvi=3&pl=21&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIgG5mx5MaQnZUWc4QRYpkWVrSGWm2SJO47kjvsCSZgReQCIQD27DW3nRwYz4QZm_cRPDfWif7g3bAFHMVGx0iH7oHOVg%3D%3D";
        musicURL ="https://www.myinstants.com/media/sounds/epic.mp3";
    }else{ 
        url=isValidHttpUrl(args[0]);
        if (url.valid){
            if (url.content.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)){ //testing if link is from youtube 
                MusicInfo = await ytdl.getInfo(url.content);
                musicURL=MusicInfo.formats[0].url;
                console.log(`playing ${url.content}`)
                
            }
        }
        else{
        }
    }
    console.log(`URL:  ${musicURL}`)
    try{
        const resource = createAudioResource(musicURL, {
            inputType: StreamType.Arbitrary,
        });

        /**
         * We will now play this to the audio player. By default, the audio player will not play until
         * at least one voice connection is subscribed to it, so it is fine to attach our resource to the
         * audio player this early.
         */
        player.play(resource);
        connection.subscribe(player);
        message.channel.send(`playing Song: ${musicURL}`)
     /**
     * Here we are using a helper function. It will resolve if the player enters the Playing
     * state within 5 seconds, otherwise it will reject with an error.
     */
    //console.log(player._state.status);
    return entersState(player, AudioPlayerStatus.Playing, 5e3);
    }catch{
        message.channel.send(`:x: Der Song kann nicht abgespielt werden`);
        return;
    }
}

function pauseMusic(message){
    getValidConnection(message);
    //return;
    if (player._state.status == "playing"){
        player.pause();
        message.reply("Musik wurde pausiert");
        console.log("paused music");
    } else{
        console.error("no music to pause")
        return;
    }
}
function stopMusic(message){
    player.stop();
    console.log("stopped music");
}
function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return {
            valid: false,
        };
    }

    return {
        valid: true,
        host: url.host,
        content: url.href
    };
}

async function discordTogether(message,args){
    console.log("discord together");
    if (typeof args[0] == "undefined"){
        message.channel.send(`Verbinde dich mit einem VC und gebe den Befehl ${prefix}d2g yt/poker/chess/checkers ein um die neuen Funktionen zu  testen`);
    }
    if (message.member.voice.channel) {
        inviteCode=0
        if(args[0]=="yt"){
            await client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
                //return message.channel.send(`${invite.code}`);
                inviteCode=invite.code
            });
        }else if (args[0] == "poker") {
            await client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'poker').then(async invite => {
                //return message.channel.send(`${invite.code}`);
                inviteCode = invite.code
            });
        } else if (args[0] == "chess") {
            await client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'chess').then(async invite => {
                //return message.channel.send(`${invite.code}`);
                inviteCode = invite.code
            });
        } else if (args[0] == "checkers") {
            await client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'checkers').then(async invite => {
                //return message.channel.send(`${invite.code}`);
                inviteCode = invite.code
            });
        }
        message.channel.send(`${inviteCode}  (autodelete: 20s)`)
            .then(msg => {
                setTimeout(() => msg.delete(), 20000)
            })
            .catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
        message.delete();
    }else{
        message.channel.send("verbinde dich bitte erst mit einem VC");
    }
}