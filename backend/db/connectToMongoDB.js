import mongoose from "mongoose";

const connectToMongoDB= async() =>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("connecting to DB");
        
    } catch (error) {
        console.log("error networking",error.message);
        
    }
}

export default connectToMongoDB;