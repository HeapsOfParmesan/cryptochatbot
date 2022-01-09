import dotenv from 'dotenv'
import axios from 'axios'
import {Client, Intents, Message} from 'discord.js';
import fs from 'fs'
import url from 'url'
import mongoose from 'mongoose'
import messages from "./models/messageModel.js";
import users from './models/userModel.js'
import balances from './models/balanceModel.js'

dotenv.config()

async function dbConnect() {
    // await mongoose.connect(process.env.LOCAL_DB);
    await mongoose.connect(process.env.REMOTE_DB);
}
dbConnect().catch(err => console.log(err));

mongoose.connection.once('open', () => {
    console.log('DB CONNECTED')
})
const prefix = '-';

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
// client.use(cors())

client.on('ready', async() => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on('messageCreate', async message => {

        if(!message.content.startsWith(prefix) || message.author.bot){
            return;
        }
    if (message.channel.type == "dm") {
        await message.reply("You are DMing me now!");
        return;
    }
    logToDB(message)

        let input = message.content.substring(1)
        let command = input.split(" ");

    if(command[0] == 'register'){
        let newUser = {
            username:message.author.username,
            userid:message.author.id,
            bot:message.author.bot,
            timestamp:message.createdTimestamp
        }
        console.log(newUser)

        // newMessageModel.findOne({}, function (err, data){
        //     if(err){
        //         console.log('not found')
        //     }else{
        //         console.log('RETRIEVED DATA BELOW\n' + data)
        //     }
        // })
        // let a = await checkIfRegistered( newUser, (data) =>{
        //     console.log(data)
        // })

        await checkIfRegistered(newUser)

        await message.reply('User registered');
    }
    if(command[0] == 'help'){
        help();
    }

    console.log('COMMAND 1' + command[0])
});

function logToFile(logstring){
    fs.appendFile("testlog.txt", " \n" + logstring + " \n" +
        "TIME: " + Date.now() + " \n" +
        "============================================",
        function (err){
            console.log(err)
        });
}

async function logToDB(message){
    //the first param is the name of the model being used, the second is the schema in the db,
    //Good to use plurals for the schema name
    const newMessageModel = mongoose.model('message', 'messages');

    // const newMessage = new newMessageModel({ username: message.author.username, message: message.content, timestamp: message.createdTimestamp });
    const newMessage = new newMessageModel(message);
    let writeMessage = {
        username: message.author.username,
        userid: message.author.id,
        message: message.content,
        timestamp: message.createdTimestamp,
        channelId:message.channelId
    }

    await newMessageModel.create(writeMessage, (err, data) => {
        if(err){
            console.log('ERROR STUFF BELOW \n' + err)
        }else{

            logToFile(message.content)
        }
    })
}

async function registerUser(user){
    let userModel = mongoose.model('user', 'users')
    let balanceModel = mongoose.model('balance', 'balances')

    let newUser = {
        username:user.username,
        userid:user.userid,
        bot:user.bot,
        timestamp:user.timestamp
    }

    userModel.create(newUser, (err, data) => {
        if(err){
            console.log(err)
        }else{
            // console.log('DATA WRITTEN \n' + data + '\n' + 'END OF DATA')
        }
    })

    let newBalance = {
        userid:user.userid,
        btc:0,
        eth:0,
        bnb:0,
        sol:0,
        xrp:0,
        ada:0,
        doge:0,
        algo:0,
    }

    balanceModel.create(newBalance, (err, data) => {
        if(err){
            console.log(err)
        }else{
            // console.log('DATA WRITTEN \n' + data + '\n' + 'END OF DATA')
        }
    })

}

async function checkIfRegistered(user){
    console.log(`CHECKING IF REGISTERED WITH ID: ${user.userid}`)
    let userModel = mongoose.model('user', 'users')

    userModel.findOne({'userid': user.userid}, async function(err, result){
        if(err){
            console.log('ERROR IS: \n' + err)
        }
        else{
            console.log('RESULT IS: \n' + result)
            if(result == null){
                console.log('NO RECORD EXISTS, CREATING USER.')
                await registerUser(user).then(() => {
                    return false;
                });
            }

            if(result != null){
                if(result.userid){
                    console.log('USER ID FOUND: \n' + result.userid)
                    return true;
                }
            }
        }
    })
}

function help(helpCommand){
    switch(helpCommand){
        case 'help':
            console.log('default help used')
            return 'default help used'
            break;
        case 'other':
            console.log('other help used')
            return 'other help used'
            break;
    }
}

client.login(process.env.DISCORD_TOKEN);
