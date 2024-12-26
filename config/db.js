
import mongoose from "mongoose";

const connectDB= async ()=>{

    try{
        await mongoose.connect("mongodb://localhost:27017/db_open_nest_system")
        console.log("MOngo DB Connected.")
    } catch (e){
            console.log("MongoDb not connected");
    }
}
export default connectDB;
