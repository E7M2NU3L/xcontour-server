import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const dbConnect = async () => {
    const mongoURI = process.env.MONGO_URI as string;
    console.log(mongoURI);

    mongoose.connect(mongoURI).then(() => {
        console.log("Connected to the Database");
    }).catch((err) => {
        console.log(err);
    })
};