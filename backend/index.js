import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import {bookModel} from "./models/bookModel.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.get("/", (req, res) => {
  console.log(req);
  res.send("Welcome to MERN Stack");
});


app.get("/books",async (req,res)=>{
    const books = await bookModel.find({});
    res.status(200).json({success:true,data:books})

})
app.post("/book/delete", async (req,res)=>{
    try{
        if(!req.body.bookId){
            return res.status(400).send({
                message:'Send book id'
            })
        }
        const book = await bookModel.findByIdAndDelete(req.body.bookId);
        if(!book){
            return res.status(404).send({
                message:'Book not found'
            })
        }
        res.status(200).send({message:'Book deleted successfully'})
    }

    catch(error){
        console.log(error);
        res.json({message:error.message , success:false}) 
    }
})

app.put("/book/update", async (req,res)=>{ 
    try{
        if(!req.body.bookId){
            return res.status(400).send({
                message:'Send book id'
            })
        }
        const book = await bookModel.findByIdAndUpdate(req.body.bookId,req.body);
        if(!book){
            return res.status(404).send({
                message:'Book not found'
            })
        }
        res.status(200).send({message:'Book updated successfully'})
    }

    catch(error){
        console.log(error);
        res.json({message:error.message , success:false})
    }
})

app.post("/books", async (req,res)=>{
    try{
        if(!req.body.title || !req.body.author || !req.body.publishYear){
            return res.status(400).send({
                message:'Send all required fields : title, author , publishYear'
            })
        }

        const newBook = {
            title:req.body.title,
            author:req.body.author,
            publishYear:req.body.publishYear
        }

        const book = new bookModel(newBook);
        const createdBook = await book.save();
        res.status(201).send(createdBook);
       
    }

    catch(error){
        console.log(error);
        res.json({message:error.message , success:false})
    }
})

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("DB Connected");
    app.listen(PORT, () => {
      console.log(`Server Running at PORT ${PORT}`);
    });
  })
  .catch(() => {
    console.log("DB Connection Failed");
  });
