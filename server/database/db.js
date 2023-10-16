import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const connectToDB = async () => {
    if(process.env.DB_URI) {
        try {
            await mongoose.connect(process.env.DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                dbName: "todo-app",
            });
            console.log("Connected to DB");
        } catch (error) {
            console.log(error);
        }
    }
};

export default connectToDB;