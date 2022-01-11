import mongoose from 'mongoose';

const rawMessageSchema = new mongoose.Schema({
    channelId: {type:String},
    guildId:{type:String},
    id: {type: String},
    content:{type: String},
    createdTimestamp: {String},
    type: {String},
    system: {Boolean},
})
export default mongoose.model('raw_message', rawMessageSchema)
