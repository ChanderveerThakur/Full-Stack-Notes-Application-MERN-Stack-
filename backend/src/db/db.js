const mongoose = require ('mongoose');


async function ConnectDB() {

    try{

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database is connected successfully")
    }
    catch(err){

        console.error("DB connection errror:", err)
    }


}

module.exports = ConnectDB;