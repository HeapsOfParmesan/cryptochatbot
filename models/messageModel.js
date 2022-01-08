import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    username: {type:String},
    userid: {type:String},
    message:{type:String},
    timestamp:{type:String},
    channelId:{type:String}
})

export default mongoose.model('message', messageSchema)
