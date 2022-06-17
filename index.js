const express = require('express');
require("./db/config");
const User = require("./db/Users")
const Product = require("./db/Product")
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res)=>{
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;    
    res.send(result);
})

app.post("/login", async (req, res)=>{
    if(req.body.email && req.body.password){
    let user = await User.findOne(req.body).select("-password");
    if(user){
        res.send(user);
    }
    else{
        res.send({result: "No user found"});
    }
}
 else{
    res.send({result: "Please provide valid email and password"});
}
})
app.post("/add-product", async (req, res)=>{
    let products = new Product(req.body);
    let result =await products.save();
    res.send(result);
})

app.get("/products", async (req, res)=>{
    let products = await Product.find();
    if(products.length>0){
        res.send(products)
    }
    else{
        res.send({result: "No products found"})
    }
})

app.delete("/product/:id", async(req,res)=>{
    const result = await Product.deleteOne({_id: req.params.id});
    res.send(result);
})

app.get("/product/:id", async(req, res)=>{
    const result = await Product.findOne({_id: req.params.id});
    if(result){
        res.send(result);
    }
    else{
        res.send({result: "No product found"});
    }
})
app.put("/product/:id", async(req, res)=>{
    const result = await Product.updateOne(
        {_id: req.params.id},
        {$set: req.body}
    )
    res.send(result);
})
app.get("/search/:key", async(req, res)=>{
    let result = await Product.find({
        "$or": [
            {name: {$regex: req.params.key}},
            
        ]
    })
    res.send(result);
})
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});
