import mongoose from "mongoose";

const cnnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default cnnectDB;