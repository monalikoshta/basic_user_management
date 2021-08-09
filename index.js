require("dotenv").config();
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path')
const multer = require('multer')

const port = process.env.PORT || 5000;
const secret_key = process.env.TOKEN

const userServices = require('./services/user');
const auth = require('./middleware/auth')
const changePassword = require('./routes/v1/changePassword')
const info = require('./routes/v1/info')
const updateUser = require('./routes/v1/updateUser')

const app = express();
// app.use(express.urlencoded({limit: "50mb", extended: true }));
// app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true}));
app.use(express.json())

const storage = multer.diskStorage({
    destination: 'images', // Destination to store image 
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage})

app.post('/register',upload.single('profile_picture'),(req,res)=>{
    const {name,email,mobile,password} = req.body;
    if(name && email && password){
        // const token = jwt.sign({ user_id: name, email }, secret_key, { expiresIn: "2h"});
        res.status(201).json(userServices.register(name,email,mobile,password,req.file.filename))
    }
    else{
        res.status(409).json({'msg': 'Please provide name, email and password.'})
    }
})

app.post('/login',(req,res)=>{
    const {email,password} = req.body;
    if(email && password){
        const token = jwt.sign({ user_id: email, password }, secret_key, { expiresIn: "1h"});
        res.status(201).json(userServices.login(email,password,token))
    }
    else{
        res.status(409).json({'msg': 'Please provide name and password both.'})
    }
})

app.get('/info/:id' , auth , (req,res)=>{
    if(!req.user){
        res.status(201).json({'msg': 'Please check that you have registered/login'})
    }
    else{
        res.status(201).json(info.getInfo(req.params.id))
    }
})

app.post('/update' ,[auth, upload.single('profile_picture')], (req,res)=>{
    if(!req.user){
        res.status(201).json({'msg': 'Please check that you have registered/login'})
    }
    else{
        const {name,email,mobile} = req.body
        res.status(201).json(updateUser.updateUser(req.user.user_id, name, email, mobile, req.file.filename))
    }
})

app.post('/changePassword' , auth , (req,res)=>{
    if(!req.user){
        res.status(201).json({'msg': 'Please check that you have registered/login'})
    }
    else{
        const {currentPassword, newPassword} = req.body
        // console.log(req.user.user_id)
        res.status(201).json(changePassword.changePassword(req.user.user_id,currentPassword, newPassword))
    }
    
})

app.listen(port,()=>{
    console.log('Server is up and is listening to port:',port);
})

