
require("dotenv").config();

const express=require('express');
const mongoose=require('mongoose');
const {body,validationResult}=require('express-validator');
const app=express();
const path=require('path');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const expressLayout=require('express-ejs-layouts');
const authMiddleware=require('./middleware/authMiddleware')
const User=require('./server/models/user');
const flash = require('express-flash');
const session =require('express-session');
const methodOverride=require('method-override');
const router=require('./server/routes/usermanage')
const connectDB=require('./server/config/db')
const port=8080 || process.env.PORT;

connectDB();

//Templating engine
app.use(expressLayout);
app.set('layout','./layout/main');
app.set('view engine','ejs');

//Cache control
app.use((req, res, next) => {
  res.header("Cache-Control", "no-cache, private, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//static files
app.use(express.static(path.join(__dirname,'public')));
// Express session
app.use(
  session({
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie:{
      maxAge:1000 * 60 * 60 * 24 *7  //1 week
    }
  })
);

//flash messages
app.use(flash({sessionKeyName:'flashMessage'}));

//Routes
app.get('/adminloginPage',router);
app.post('/admin',router);
app.get('/admin',router)
app.get('/add',router);
app.post('/add',router);
app.get('/view/:id',router);
app.get('/edit/:id',router);
app.put('/edit/:id',router);
app.delete('/edit/:id',router);
app.post('/search',router);


// app.get('/admin',(req,res)=>{
//   res.render('index',{admin:true})
// })

app.get('/',(req,res)=>{
    res.render('register',{admin:false});
})
app.get('/login',(req,res)=>{
    res.render('login',{admin:false})
})

app.get('/logout',(req,res)=>{
    res.clearCookie('accessToken');
    res.redirect('/login');
});

app.post('/home',[
    body('userName').trim().notEmpty().withMessage('Username is required'),
    body('email').trim().isEmail().withMessage(' Email address required'),
    body('password').trim().isLength({min :6}).withMessage('Password must be atleast 6 characters'),
    body('confirmPassword').trim().custom((value,{req})=>value===req.body.password).withMessage('Password do not match'),
],

async (req, res) => {
 
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('register', { errors: errors.array(),admin:false });
      }

      const { userName, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render('register', { errors: [{ msg: 'Email already exists' }],admin:false });
      }

      const hashedPassword=await bcrypt.hash(password,10);
      console.log(hashedPassword);
      const user=await User.create({
        userName,
        email,
        password:hashedPassword
      })
      
      console.log(`user created successfully ${user}`);

      res.render('home',{user:userName,admin:false});
    } catch (error) {
      console.log(error);
      res.render('error',{admin:false});
    }
  }
);
app.post('/login-process',async (req,res)=>{
 
  //console.log(req.body);
  const { email,password }=req.body;
  //console.log(password)
  if(!email || !password){
    return res.render("login",{error:"Please enter username or password",admin:false});
  }
 const user=await User.findOne({email});
 //console.log(user);
  //compare password
  const isPasswordValid=await bcrypt.compare(password,user.password)
 // console.log(isPasswordValid);
  if(user && isPasswordValid)
{
  const accessToken=jwt.sign({
    user:{
      userName:user.userName,
      email:user.email,
      id:user.id
    }
  },process.env.ACCESS_TOKEN_SECRET,
  {expiresIn:"1m"}
  )
 // console.log(accessToken);
  return res.cookie('accessToken', accessToken).render("home",{user:user.userName,admin:false});
  }else{
  return res.render("login",{error: "Invalid username or password",admin:false});
}

})

app.get('*',(req,res)=>{
  res.render("404",{admin:false});
})
app.listen(port, ()=>{
    console.log(`Server is running on port : ${port}`);
})