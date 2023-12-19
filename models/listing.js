const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const listeningSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: String,
    image: {
        type: String,
        default:
            'https://4192879.fs1.hubspotusercontent-na1.net/hub/4192879/hubfs/5cb5f901f929104729adbb8e_shutterstock_1152936797.jpg?width=944&height=590&name=5cb5f901f929104729adbb8e_shutterstock_1152936797.jpg',
        set: (v) =>
            v === ""
                ? "https://4192879.fs1.hubspotusercontent-na1.net/hub/4192879/hubfs/5cb5f901f929104729adbb8e_shutterstock_1152936797.jpg?width=944&height=590&name=5cb5f901f929104729adbb8e_shutterstock_1152936797.jpg"
                : v,
    },
    price: Number,
    location: String,
    country: String,

});


const Listing = mongoose.model('Listing', listeningSchema);

module.exports = Listing;
