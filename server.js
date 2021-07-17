const express = require('express')
const path = require('path')
const app = express()
require("./src/db/conn")
const Register = require('./src/models/registers')
const port = process.env.PORT || 8000;
const bcrypt = require('bcrypt');
const auth = require("./src/middleware/auth")

require('dotenv').config()
const cookieparser = require('cookie-parser')

app.use(cookieparser())
console.log(process.env.SECRET + "hello ")
const staticpath = path.join(__dirname,'/public')

app.use(express.static(staticpath))

app.set('view engine','ejs')

app.get('/',(req,res)=>{
    
    res.render("index",{name:"jagatheeswar"})    
})

app.get('/login',(req,res)=>{
    res.render('login.ejs')
})

app.get('/register',(req,res)=>{
    res.render('register.ejs')
})
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.post('/register',async(req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if(cpassword === password){
            console.log("entered")
            var registerUser = new Register({
                
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                age:req.body.age,
                number:req.body.number,
                gender:req.body.gender,
                password:req.body.password,
                cpassword:req.body.cpassword,
        })
        console.log("the successpart"+registerUser)
        const token = await registerUser.generateAuthToken()
        console.log(token + ": tokaen")
        
        res.cookie("regcookie",token,{
            expires: new Date(Date.now()+30000),
            httpOnly: true
        });
        console.log(cookie)
        //password hash

        console.log("hello")
            const registered = await registerUser.save()
            res.status(201).render('index.ejs',{name:req.body.firstname});
    }else{
        res.send("password not matching")
    }
}
    catch(error){
        res.status(400).send(error)
        console.log("the error page")
    }
})

app.get('/secret',auth,(req,res)=>{
    console.log(`this is cookie ${req.cookies.jwt}`)
    
    res.render('secret.ejs')
})

app.post('/login', async (req,res)=>{
    try{
        const email =  req.body.email
        const password =  req.body.password
        
       const useremail = await Register.findOne({email:email});
        const ismatch = await bcrypt.compare(password,useremail.password)
        console.log(ismatch)
        console.log(password)
        console.log(useremail.password)
        
       const token = await useremail.generateAuthToken()
       console.log(token)
        
       res.cookie("jwt",token,{
        expires: new Date(Date.now()+60000),
        httpOnly: true
    });
    
        if(ismatch)
        {
        console.log("login illlllll")        
        res.status(201).render('index.ejs',{name:useremail.firstname});
    }
        else
        res.redirect('login')
    }
    catch(error){
        res.status(400).send(error)
    }

})


const jwt  =  require('jsonwebtoken')
const createtoken = async() =>{
    const token = await jwt.sign({_id : "60f1828985d2a6219017e761"},"iffowenoifiowerjksfdjowerjjfsdjksdiowoier")
    console.log(token)
    const userverf = await jwt.verify(token,"iffowenoifiowerjksfdjowerjjfsdjksdiowoier")
    console.log(userverf)    
}
createtoken();
app.listen(port,()=>{
    console.log(`server is running  at port no ${port}`)
})