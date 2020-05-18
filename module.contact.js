const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let Contactacademy = new Schema({
    name: {
        type: String
    },
    country: {
        type: String
    },
    email : {
        type: String
    },
    category: {
        type: String
    },
    subcategory: {
        type:String
    },
    phone:{
        type: Number
    },
    zip: {
        type: Number
    }
});
module.exports = mongoose.model('Contact',Contactacademy);