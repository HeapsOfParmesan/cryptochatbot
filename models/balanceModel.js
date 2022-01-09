import mongoose from 'mongoose';

const balanceSchema = new mongoose.Schema({
    userid: {type:String},
    usd:{type:Number},
    btc:{type:Number},
    eth:{type:Number},
    bnb:{type:Number},
    sol:{type:Number},
    xrp:{type:Number},
    ada:{type:Number},
    algo:{type:Number},
    doge:{type:Number},
})

export default mongoose.model('balance', balanceSchema)
