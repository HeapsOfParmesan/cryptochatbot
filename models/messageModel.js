import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    username: {type:String},
    userid: {type:String},
    message:{type:String},
    timestamp:{type:String},
    channelId:{type:String},

    type:{type:String},
    pinned:{type:Boolean},

    tts:{type:Boolean},
    system:{type:Boolean},
    nonce:{type:String},


})

export default mongoose.model('message', messageSchema)
