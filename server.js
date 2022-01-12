import dotenv from 'dotenv'
import axios from 'axios'
import {Client, Intents, Message} from 'discord.js';
import fs from 'fs'
import url from 'url'
import mongoose from 'mongoose'
import messages from "./models/messageModel.js";
import users from './models/userModel.js'
import balances from './models/balanceModel.js'
import coins from './models/coinModel.js'
import rawMessageModel from "./models/rawMessageModel.js";
import * as Process from "process";

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


////////////////////////////
//////   INTERVALS   ///////

// setInterval(updateCoins, Process.env.COINGECKO_REFRESH_TIME );
// setInterval(updateCoins,60000 );


////////////////////////////
//
// client.on('message', async message => {
//     console.log('DM RECEIVED')
//     if (message.channel.type == "dm") {
//         await message.author.send("You are DMing me now!");
//         return;
//     }
// });


client.on('messageCreate', async message => {


    // console.log(message)
    // let rawMessage = mongoose.model('raw_message', 'raw_messages')
    await rawMessageModel.create(message)

    if(!message.content.startsWith(prefix) || message.author.bot){
        return;
    }
    // if (message.channel.type == "dm") {
    //     await message.reply("You are DMing me now!");
    // }
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


    if(command[0] == 'coins'){
        // await message.reply(await getCoinNames());
        await storeCoinPrices();
        await message.reply('storing coins hopefully')
    }
    if(command[0] == 'newcoins'){
        // await message.reply(await getCoinNames());
        await updateCoins()
        await message.reply('updating coins hopefully')
    }
    if(command[0] == 'balance'){
        // await message.reply()
        // await getBalance(message.author.id)

        let maybeUser = balances.find({userid:message.author.id}, {}, {},  (async (error, result) => {
            let replyString = ``;
            if(error){
                console.log(error)
                return 'No balance'
            }
            if(result){
                // console.log(result.usd)
                // replyString += result
                let resultJson = JSON.stringify(result[0])
                let newString = JSON.parse(resultJson)
                // console.log(newString.usd)

                // return result.usd
                await message.reply( newString.usd.toString())
            }
        }))

    }

    if(command[0] == 'buy'){
        if(command[1] && command[1] != ''){
            if(command[2] && command[2] != ''){


                let maybeUser = balances.find({userid:message.author.id}, {}, {},  (async (error, result) => {
                    let replyString = ``;
                    if(error){
                        console.log(error)
                        return 'No balance'
                    }
                    if(result){

                        let resultJson = JSON.stringify(result[0])
                        let newString = JSON.parse(resultJson)


                        let price = Number.parseFloat(await getPriceOfCoin(command[1]))
                        console.log(price)

                        await message.reply( newString.usd.toString())
                    }
                }))

            }

        }




    }
    if(command[0] == 'bal'){
        if(command[1] && command[1] != '')
        await message.reply(await getPriceOfCoin(command[1]));
    }
    if(command[0] == 'help'){
        help();
    }

    console.log('COMMAND 1' + command[0])
});

async function getPriceOfCoin(coin){
    //returns a string of the USD price of the provided coin
    if(coin !== ''){
        // if(currency != 'cad' || currency != 'usd' || currency != 'gbp' || currency != 'rub'){
        //     currency = 'cad';
        // console.log("CURRENCY SET ",currency)
        // }
        // console.log("CURRENCY AFTER SET ",currency)
        let queryUrl=`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`;
        let price = await axios.get(queryUrl);
        console.log( price.data[coin]['usd']);
        return price.data[coin]['usd'].toString();
    }
}

function logToFile(logstring){
    fs.appendFile("testlog.txt", " \n" + logstring + " \n" +
        "TIME: " + Date.now() + " \n" +
        "============================================",
        function (err){
            console.log(err)
        });
}

async function logToDB(message){
    //Logs message to the database

    let writeMessage = {
        username: message.author.username,
        userid: message.author.id,
        message: message.content,
        timestamp: message.createdTimestamp,
        channelId:message.channelId,

        type:message.type,
        pinned:message.pinned,

        tts:message.tts,
        system:message.system,
        nonce:message.nonce

    }

    await messages.create(writeMessage, (err, data) => {
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
        usd:1000000,
        btc:0,
        eth:0,
        bnb:0,
        sol:0,
        xrp:0,
        ada:0,
        doge:0,
        algo:0,
    }

    balances.create(newBalance, (err, data) => {
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

    await userModel.findOne({'userid': user.userid}, async function(err, result){
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

async function getBalance(user){
    const userModel = mongoose.model('balance', 'balances')
    let maybeUser = userModel.find({userid:user}, {}, {}, ((error, result) => {
        if(error){
            console.log(error)
            return 'No balance'
        }
        if(result){
            console.log(result)
            return result.usd
        }
    }))

}

async function getStoredCoinNames(){
    let coinList = coins.find({}, {}, {})
    // for (let coinListKey in coinList.result) {
    //     console.log(coinListKey)
    // }
    console.log(coinList)
}

async function getCoinNames(){
    //returns a string 100 coins and their prices in usd supported by the api
    let data = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
    // console.log(data.data)
    let message = ``;
    data.data.forEach((coin)=>{message = message + `\n` + coin.name  + ` - ` + coin.current_price})
    return `DATA SHOULD BE HERE \n ${message}`;
}

async function storeCoinPrices() {
    //get coin prices from the api and store them in the db
    let data = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
    let coinArr = [];
    const coinModel = mongoose.model('coin', 'coins');

    data.data.forEach((coin) => {
        coinArr.push(coin)
    })

    console.log('COIN ARRAY \n' + coinArr)
    coinArr.forEach(e => console.log(e.name))

    await coinModel.insertMany(coinArr, (err) => {
        if (err) {
            console.log(err)
        }
    });
}

async function updateCoins(){
    //update the coin prices and data in the db
    let data = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
    let coinArr = [];
    const coinModel = mongoose.model('coin', 'coins');

    data.data.forEach((coin) => {
        coinArr.push(coin)
    })
    coinArr.forEach((coin) => {

        let update = {
            symbol: coin.symbol,
            name: coin.name,
            current_price: coin.current_price,
            market_cap: coin.market_cap,
            market_cap_rank: coin.market_cap_rank,
            total_volume: coin.total_volume,
            high_24h: coin.high_24h,
            low_24h: coin.low_24h,
            price_change_24h: coin.price_change_24h,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            market_cap_change_24h: coin.market_cap_change_24h,
            market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
            circulating_supply: coin.circulating_supply,
            total_supply: coin.total_supply,
            max_supply: coin.max_supply,
            ath: coin.ath,
            ath_change_percentage: coin.ath_change_percentage,
            ath_date: coin.ath_date,
            atl: coin.atl,
            atl_change_percentage: coin.atl_change_percentage,
            atl_date: coin.atl_date,
            roi: coin.roi,
            last_updated: coin.last_updated
        }

        coinModel.updateMany( { id : coin.id}, update, {upsert:true}, function (error){
            if(error){console.log(error)}
        })
        console.log(coin)
    })
}

client.login(process.env.DISCORD_TOKEN);

