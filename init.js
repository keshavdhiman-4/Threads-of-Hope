const mongoose = require("mongoose");
const User = require("./models/chat.js");

main()
    .then(() => 
        console.log("Connection successful"))
    .catch(err => 
        console.log(err));
 
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/toh');
}

let allUsers =  [
    {
        Username: "keshavdhiman123@yahoo.com",
        FirstName: "Keshav",
        LastName: "Dhiman",
        Location: "V.P.O. Jakhera, Distt. UNA, HP - 174315",
        Donations: 3,
        Rewards: 1,
        Password: "KD#1234",
        Story: "I am blessed to be able to help others.",
    },
    {
        Username: "heena123@yahoo.com",
        FirstName: "Heena",
        LastName: "Sharma",
        Location: "Flat No. 203, Block A, Sector 62, Noida, Uttar Pradesh, 201301",
        Donations: 1,
        Rewards: 0,
        Password: "HS#1234",
        Story: "Its really satisfying when we see smile on others' face and the reason of their happiness is you."
    },
];

User.insertMany(allUsers);