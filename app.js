// function print(){
//     console.log("express")
// }
// print()

// const express = require("express");
// const mongoose = require("mongoose")
// const app = express();
// const port=3001;

// const mongourl="mongodb://localhost:27"

// const data=[
//     {id:1,name:"vishali",address:"TVM"},
//     {id:2,name:"sangeetha",address:"KPR"},
//     {id:3,name:"vimal",address:"CBE"},
// ];

// app.get('/student/details',(req,res)=>{
//     res.json(data);
// });

// app.listen(port,()=>{
//     console.log(Server is running on http://localhost:${port});
// });

// app.get('/api/singledata',(req,res)=>{
//     const{name,id}=req.query;

//     if(name,id){
//         const result = data.find(item=> item.name===String(name) && item.id===Number(id));
//         if(result){
//             res.json(result)
//         }else{
//             res.status(400).json({error:"Data not found "})
//         }
//     } else {
//         res.json(data);
//     }
// });

// const express=require("express");
// const mongoose=require("mongoose");
// const app=express();
// const port=3500;



// const mongoUrl="mongodb+srv://vishali:visha26@cluster0.xtn7uvc.mongodb.net/Expense-Tracker";
// mongoose.connect(mongoUrl)
// .then(()=>{
//     console.log("Database Connected Successfully")
//     app.listen(port,()=>{
//         console.log(Server is running at port ${port})
//     })
// })
// .catch((err)=>{
//     console.log(err);
// })

// const expenseSchema=new mongoose.Schema({
//     id:{type:String,required:true,unique:true},
//     title:{type:String,required:true},
//     amount:{type:Number,rrequired:true}
// });

// const expenseModel=mongoose.model("expense-trackers",expenseSchema);

// app.get("/api/expenses/:id",async(req,res)=>{
//     try{
//         const{id}=req.params;
//         const expenses = await expenseModel.findOne({id});
//         if(!expenses){
//             return res.status(404).json({message:"Expense not found"})
//         }
//         res.status(200).json(expenses);
//     }catch(error){
//         res.status(500).json({message:"Error in fetching Expenses"});
//     }
// });

// app.use(express.json());
// const{v4:uuidv4}=require("uuid");
// app.post("/api/expenses",async(req,res)=>{
//     try{
//         const data=req.body;
    
    
//         const newExpense=new expenseModel({
//           id:uuidv4(),
//           title:data.title,
//           amount:data.amount,
//     });
//     const savedExpense=await newExpense.save();//save to database
//     res.status(200).json(savedExpense);//send response
//   }catch(error){
//     console.error(error);
//     res.status(500).json({message:"Error saving expense",error:error.message});
//   }
// });

// app.use(express.json);
// app.put("/api/expenses/:id", async (req,res)=>{
//     const {id} = req.params;
//     const {title,amount} = req.body;
//     console.log({title})
//     try{
//         const updateExpense = await expenseModel.findOneAndUpdate(
//             {id},
//             {title,amount}
//         );
//         if(!updateExpense){
//             return res.status(400).json({message:"Expense not found"});
//         }
//         res.status(200).json({title,amount});
//     }
    
// catch(error){
//         res.status(500).json({message:"Error in updating expense"});
//     }
// });

// app.use(express.json());

// app.delete('/api/expenses/:title', async (req, res) => {
    
//     const { title } = req.body;

//     try {
//         const deletedExpense = await expenseModel.findOneAndDelete({ title });

//         if (!deletedExpense) {
//             return res.status(404).json({ message: "Expense not found" });
//         }

//         res.status(200).json({ message: "Expense deleted successfully", deletedExpense });
//     } catch (error) {
//         console.error(error); 
//         res.status(500).json({ message: "Error deleting expense", error: error.message });
//     }
// });

// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB connection URL
const mongoUrl = "mongodb+srv://dbuser:agnel@cluster0.ek7nz.mongodb.net/Expense-Tracker";

// Connect to MongoDB
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Define Mongoose Schema and Model
const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
});

const expenseModel = mongoose.model("expense-trackers", expenseSchema);

// Routes

// GET: Fetch an expense by ID
app.get("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await expenseModel.findOne({ id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error in fetching expense", error: error.message });
  }
});

// POST: Create a new expense
app.post("/api/expenses", async (req, res) => {
  const { title, amount } = req.body; // Parse data from request body
  try {
    const newExpense = new expenseModel({
      id: uuidv4(), // Generate a unique ID
      title,
      amount,
    });
    const savedExpense = await newExpense.save(); // Save to database
    res.status(201).json(savedExpense); // Send success response
  } catch (error) {
    res.status(500).json({ message: "Error creating expense", error: error.message });
  }
});

// PUT: Update an expense by ID
app.put("/api/expenses/:id", async (req, res) => {
  const { id } = req.params; // Extract ID from request params
  const { title, amount } = req.body; // Parse updated data from request body
  try {
    const updatedExpense = await expenseModel.findOneAndUpdate(
      { id },
      { title, amount },
      { new: true } // Return the updated document
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error: error.message });
  }
});

// DELETE: Delete an expense by title
app.delete("/api/expenses/:title", async (req, res) => {
  const { title } = req.params; // Extract title from request params
  try {
    const deletedExpense = await expenseModel.findOneAndDelete({ title });
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully", deletedExpense });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error: error.message });
  }
});