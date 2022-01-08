import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {type:String},
    userid: {type:String},
    bot:{type:Boolean},
    timestamp:{type:String},

})

export default mongoose.model('user', userSchema)
