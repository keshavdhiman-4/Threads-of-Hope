const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
    }, 
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Location: {
        type: String,
        default: " ",
    },
    Donations: {
        type: Number,
        default: 0,
    },
    Rewards: {
        type: Number,
        default: 0,
    },
    Password: {
        type: String,
        required: true,
    },
    Story: {
        type: String,
        default: '',
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;