const express = require('express')
const app = express();
const PostRouter = require("./routes/post.route")
const UserRouter = require("./routes/user.route");
require('dotenv').config();
const PORT = process.env.PORT
const cors = require('cors')


app.use(express.json());
app.use(cors());

app.use("/user" , UserRouter);
app.use("/post" , PostRouter);


app.listen(PORT , function(){
    console.log("App is working")
})