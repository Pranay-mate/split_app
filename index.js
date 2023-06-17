const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose =  require('mongoose');

dotenv.config();


const userRoutes = require('./routers/userRouter.js');
const groupRoutes = require('./routers/groupRouter.js');
const expenseRoutes = require('./routers/expenseRouter');

const Campaign = require('./models/userModel.js');
const Group = require('./models/groupModel.js');
const Expense = require('./models/expenseModel');

const app = express();
app.use(express.json());
app.use(bodyParser.json({limit: '30mb', extends: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extends: true}));
app.use(cors()); 

const users = [];

app.use('/api/', userRoutes);
app.use('/api/', groupRoutes);
app.use('/api/', expenseRoutes);


const uri = "mongodb+srv://Pranay:Of2nm0wUJ1fgrJaC@cluster0.kx27fbs.mongodb.net/?retryWrites=true&w=majority";

const port = process.env.PORT || 5000;

if(process.env.NODE_ENV === 'production'){
    app.use(express.static("split_app/build"))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'split_app','build','index.html'))
    })
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(port, () => console.log(`Server Running on Port: http://localhost:${port}`)))
.catch((error) => console.log(`${error} did not connect`));
