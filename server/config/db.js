const mongoose=require('mongoose');
mongoose.set('strictQuery',false);

const connectDB=async()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/UserDB',{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("Connected to mongoDB")
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}
module.exports=connectDB;