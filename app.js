//function print() {
//console.log('express');
//}
//print();

/*
const express = require('express');
const app = express();

const port = 5500;

const data=[
    {id:1, name:'a',address:'aa'},
    {id:2, name:'b',address:'bb'},
    {id:3, name:'c',address:'cc'},
];

app.get('/student/details', (req, res) => {   //to get data from server(to call)
  res.json(data);                       // it is a promise  //to get url
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
*/

/*
const express = require('express');
const app = express();

const port = 2200;

const data=[
    {id:1, name:'a',address:'aa'},
    {id:2, name:'b',address:'bb'},
    {id:3, name:'c',address:'cc'},
];

app.get('/api/singledata', (req, res) => {   //to get data from server(to call)
  const {id,name} = req.query;                  // it is a promise  //to get url
  if(name){
    const result = data.find(item => item.id===Number(id)&&item.name === name);
    if(result){
        res.json(result);
    } else {
        res.status(400).json({error:'data not found'});
    }
  } else {
    res.json(data);
  }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
*/
/*
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3300;

const mongourl = 'mongodb://localhost:27017/practice';
mongoose.connect(mongourl)
    .then(() => {
        console.log('Database connected successfully');
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
*/

const express = require("express");
const mongoose = require("mongoose")
const app = express();
app.use(express.json())
const port = 3000;



const mongourl = "mongodb+srv://dbuser:agnel@cluster0.ek7nz.mongodb.net/Expense-Tracker";
mongoose.connect(mongourl)
    .then(() => {
        console.log("Database connected successfully");
        app.listen(port, () => {
            console.log(`Server running at port ${port}`)
        })

    })

    .catch((err) => console.log(err))

const expenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
});
const expenseModel = mongoose.model("expense-tracker", expenseSchema)

app.get("/api/expenses", async (req, res) => {
    try {
        const expenses = await expenseModel.find();
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch expenses" });
    }
});

app.get("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await expenseModel.findOne({ id });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        if (expense) {
            res.status(200).json(expense);
        }
    } catch (err) {
        res.status(500).json({ message: "Error in fetching expense" });
    }
});
const { v4: uuid } = require('uuid');
app.post("/api/expenses", async (req, res) => {
    const { title, amount } = req.body;
    // const data=JSON.parse(body);
    const newExpense = new expenseModel({
        id: uuid(),
        title: title,
        amount: amount,
    });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
});



app.use(express.json);
app.put("/api/expenses/:id", async (req,res)=>{
    const {id} = req.params;
    const {title,amount} = req.body;
    console.log({title})
    try{
        const updateExpense = await expenseModel.findOneAndUpdate(
            {id},
            {title,amount}
        );
        if(!updateExpense){
            return res.status(400).json({message:"Expense not found"});
        }
        res.status(200).json({title,amount});
    }
    
catch(error){
        res.status(500).json({message:"Error in updating expense"});
    }
});

app.use(express.json());

app.delete('/api/expenses/:title', async (req, res) => {
    
    const { title } = req.body;

    try {
        const deletedExpense = await expenseModel.findOneAndDelete({ title });

        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json({ message: "Expense deleted successfully", deletedExpense });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Error deleting expense", error: error.message });
    }
});