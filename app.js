const express = require("express");
require('dotenv').config();
const crypto = require("crypto");
const multer = require('multer');
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require('fs');
var honga=require('hogan.js');
//require('dotenv/config');
var validator = require("email-validator");
let alert = require('alert'); 
var nodemailer=require('nodemailer');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const MongoDBSession = require("connect-mongodb-session")(session);



const port=process.env.PORT;
const mongoUrl=process.env.URL;
const emailPass=process.env.PASSWORD;



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');



// const imageupload=require('express-fileupload');
// app.use(imageupload());

// const upload=multer({dest:"./uploads/"});
// app.post('/upload',upload.single("imagefile"),(req,res)=>{
// console.log(req.files);

// var imgfile =req.files,
//   filename=imgfile.name;
// imgfile.mv("/uploads/"+filename,function(err){
//   if(error){
//     console.log("cood not upload the file");
//     console.log(error);
//   }else{
//     console.log("file is uopload sucessfuly");
//   }
// });
// });








const { Console } = require("console");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const { nextTick } = require("process");
//  const { resolve } = require("path");
//  const { rejects } = require("assert");
const url = mongoUrl;
mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on('open', function () {
  console.log("conected.....");
});
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  user: { type: String, required: true },
  usermail: {
    type: String, required: true, unique: true,lowercase:true,
    match: /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  },
  u_phone_num: {
    type: Number, require: true, unique: true,
    match: /^(\+\d{1,3}[- ]?)?\d{10}$/
  },
  u_nation: String,
  u_pwd1: String,
  u_pwd2: String,
  updated: { type: Date, default: Date.now },
});
const user_instance = mongoose.model('UserModel', UserSchema);






const sailoro_schema = new Schema({
  Name: { type: String, },
  Email: { type: String,required: true, unique: true,lowercase:true},
  P_nunb: { type: Number, unique: true },
  Country: { type: String, },
  State: { type: String, },
  Address: { type: String, },
  Pincode: { type: Number, },
  Ac_numb: { type: Number, },
  Ac_Ho_name: { type: String, },
  sop_name: { type: String, },
  imagename: { type: String },
  imgdata: { data: Buffer },
  contentType: { String },
  Password: { type: String }
});
const salior_instance = mongoose.model('SailorModel', sailoro_schema);




var image_Schema = new Schema({
  Email: { type: String },
  product: {
    imagename: { type: String },
    p_name: { type: String, require: true },
    P_prise: { type: String },
    P_descount: { type: String }
  },
  img:
  {
    data: Buffer,
    contentType: String
  }
});
const image_instance = mongoose.model('ImageModel', image_Schema);




const store= new MongoDBSession({
   uri: url,
   collection: "mySessions",
}); 
  const TWO_SOURE=1000*60*60*2;
const {
  NODE_ENV='developement',
   SESS_LIFETIME =TWO_SOURE,
}= process.env
 const IN_PROD=NODE_ENV =='production';
app.use(cookieParser());
app.use(session({
  cookie:{
    maxAge:SESS_LIFETIME,
    sameSite:true,
    secure:IN_PROD,
  },
  secret:"key that will sign cookie",
  resave:false,
  saveUninitialized:false,
  store: store,
  })
  );

  const isAuth = (req,res,next)=>{
       if(req.session.isAuth){
         next()
       }else{
         res.render('login_page');
       }
  }


//  app.get("/", function (req, res) {
//     res.render('test.ejs');
//    });



app.get("/", function (req, res) {
  // req.session.isAuth =true;
  const user = {
    name:req.session.email1,
  }
  const result={

  }
  const data = async () => {
    const items = await salior_instance.find()
    if (items != null) {
      items.forEach(function (item) {
        console.log(item.imagename, item.sop_name);
        res.render('food', { user, items ,result:null});

      });
    } else {
      res.render('food.ejs', { user, items: null });
    }
  }
  data();
  //res.render('food.ejs', { user,items:null });
  //res.render('food.ejs');
});

app.get("/sailor", function (req, res) {
  const users = {
    name: '',
  }
  res.render('sailor.ejs', { users });
});





// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads/')
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "_" + Date.now() + "_" +
//       path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage: storage });
// app.post('/upload', upload.single('imagefile'), (req, res) => {



//     console.log("this is ",req.file);
//   // var obj = {
//   //   sop_name: req.body.shop_name,
//   //   imagename: req.file.path,
//   //   img: {
//   //     data: fs.readFileSync(path.join(__dirname + '/public/uploads/' + req.file.filename)),
//   //     contentType: 'image/png'
//   //   }
//   // }


//   // image_instance.create(obj, (err, item) => {
//   //   if (err) {
//   //     console.log("this is error", err);
//   //   }
//   //   else {
//   //     item.save();
//   //     console.log("your file is saved");
//   //     // res.redirect('/');
//   //     //res.redirect('upload');
//   //   }
//   //   //   image_instance.find({}, (err, items) => {
//   //   //     if (err) {
//   //   //         console.log(err);
//   //   //         res.status(500).send('An error occurred', err);
//   //   //     }
//   //   //     else {
//   //   //         res.render('sailor', { items: items });
//   //   //         console.log("hai");
//   //   //     }
//   //   // });



//   //   const data = async () => {
//   //     const items = await image_instance.findOne({sop_name:req.body.shop_name})
//   //    if(req.body.shop_name==items.sop_name){
//   //     const users = {
//   //       name: items.imagename,
//   //     }
//   //     res.render('sailor', { users });
//   //     console.log(users.name);
//   //   }
//   //   }
//   //   data();

//   // });



//   const users = {
//           name: req.file.path
//         }
//         res.render('sailor', { users });
//         console.log(users.name);


// });



app.get("/login_page", function (req, res) {
  res.render('login_page.ejs');
});

app.get("/register_page", function (req, res) {
  res.render('register_page.ejs');
});

app.get("/sailor_uplode", function (req, res) {
  res.render('sailor_uplode.ejs');
});
app.get("/sailor_profile", function (req, res) {
  res.render('sailor_profile.ejs');
});
app.get("/contant_page", function (req, res) {
  res.render('contant_page.ejs');
});
app.get("/sailor_login", function (req, res) {
  res.render('sailor_login.ejs');
});

app.get("/reg_with_upload", function (req, res) {
  res.render('reg_with_upload.ejs');
});

app.get("/payment_page", function (req, res) {
  res.render('payment_page.ejs');
});

app.get("/overview_page", function (req, res) {
  res.render('overview_page.ejs');
});





app.get("/search_bar",function(req,res){

});
app.post("/search_bar",function(req,res){
  var regex= new RegExp(req.body.search,'i');
  console.log(regex);

  salior_instance.find({sop_name:regex}).then((result)=>{
    console.log(result);
    res.render('food',{result,user:null});
  });

});






app.post("/act_regestation", function (req, res) {
  var name = req.body.name1;
  var email = req.body.u_email;
  var num = req.body.num1;
  var nation = req.body.nation1;
  var pass1 = req.body.pass;
  var pass2 = req.body.conpass;
  
  var emailRegex=/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  var valid= validator.validate(email); //emailRegex.match(email);
  // var phoneRegex=/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}/;
  // var validPhone=phoneRegex.test(num);
  if (pass1 == pass2) {
    if(valid && num.length==10){
    const myUser = new user_instance({
      user: name,
      usermail: email,
      u_phone_num: num,
      u_nation: nation,
      u_pwd1: pass1,
      u_pwd2: pass2,
    });
    myUser.save(function (err) {
      res.redirect('/');
      console.log("your date is saved", err)
    });
  }else{
    console.log("Your email/pnone is not Valid");
    alert("!!Your email/pnone is not Valid");
  }
  } else {
    alert("!!!Your password does not match");
    message: "your registation failed";
  }

});





var UserEmail;
app.post("/act_login", function (req, res) {
  var name = req.body.email;
  var num1 = req.body.number;
  var pass = req.body.password;

  const data = async () => {
    const q1 = await user_instance.findOne({ usermail: name })
    if (num1 == q1.u_phone_num && name == q1.usermail && q1.u_pwd1 == pass) {
      console.log(q1.u_phone_num);
      console.log(q1.usermail);
      UserEmail=q1.usermail;
     
      const data = async () => {
        const items = await salior_instance.find()
          req.session.isAuth=true;
          req.session['email1']=name;
          // const user = {
          //   name: req.session.email1,
          // }
          console.log("hai i aam fro session=",req.session.email1);
          res.redirect("/");
      }
      data();

    }
    else {
      console.log("your name and password does not match");
      // alert("your name and password does not match")
    }
  }
  data();

});



var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" +
      path.extname(file.originalname));
  }
});
const reg_sailor = multer({ storage: storage });
var email;
app.post("/reg_sailor", reg_sailor.single('imagefile'), (req, res) => {

  var name = req.body.txt_id_name;
  var email = req.body.txt_id_email;
  var p_nunb = req.body.txt_id_pnum;
  var country = req.body.txt_id_country;
  var state = req.body.txt_state;
  var address = req.body.txt_addr;
  var pincode = req.body.txt_P_code;
  var ac_numb = req.body.txt_a_num;
  var ac_Ho_name = req.body.txt_a_name;
  var pass1 = req.body.pass;
  var pass2 = req.body.conpass;

  console.log("this is ", req.file.path);
  var emailRegex=/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  var valid=emailRegex.test(email);
  // var phoneRegex=/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}/;
  // var validPhone=p_nunb.match(phoneRegex);

  if (pass1 == pass2) {
    if(valid &&  p_nunb.length==10){
    const myUser = new salior_instance({
      Name: name,
      Email: email,
      P_nunb: p_nunb,
      Country: country,
      State: state,
      Address: address,
      Pincode: pincode,
      Ac_numb: ac_numb,
      Ac_Ho_name: ac_Ho_name,
      sop_name: req.body.shop_name,
      imagename: req.file.path,
      Password: pass1,
      imgdata: fs.readFileSync(path.join(__dirname + '/public/uploads/' + req.file.filename)),
      contentType: 'image/png'
    });
    myUser.save(function (err) {
      console.log("your date is saved", err)
      const users = {
        name: req.file.path
      }
      res.render('reg_with_upload');
      // res.render('sailor', { users });
      //console.log(imagename);
    });
  }else{ console.log("Your email/phone in valide");}
  } else { Console.log("Your password does not match"); }
});

//////////////////////////////////

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/product_img/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" +
      path.extname(file.originalname));
  }
});
const reg_uplodeprofile_part = multer({ storage: storage });
app.post("/reg_uplodeprofile_part", reg_uplodeprofile_part.single('image_file2'), (req, res) => {
  console.log(req.file.filename);

  const myUser = new image_instance({
    Email: email,
    product: {
      imagename: req.file.path,
      p_name: req.body.your_dp,
      P_prise: req.body.your_price,
      P_descount: req.body.your_desc,
    },
    img:
    {
      data: fs.readFileSync(path.join(__dirname + '/public/product_img/' + req.file.filename)),
      contentType: 'image/png',
    }

  });
  myUser.save(function (err) {
    console.log("your date is saved", err)
  });

});

//////////////////////////////////




var user_email;
var user_password;

app.post("/sailor_act_login", function (req, res) {
  var email = req.body.email;
  var num1 = req.body.number;
  var pass = req.body.password;

  const data = async () => {

    const items = await salior_instance.find()
    items.forEach(function (q2) {
      if (email == q2.Email && num1 == q2.P_nunb) {
        user_email = q2.Email;
        user_password = q2.Password;
        console.log("this is login", user_email);
        alert("your login");
      }
    })
  }
  data();

  const data2 = async () => {
    var objs;
    var ite;
    objs = await image_instance.find()
    // objs.forEach(function(item){
    if (objs != null) {
      for (var i = 0; i < objs.length; i++) {
        console.log("kaya bat hai", objs.length, i);
        console.log("kaya bat hai", objs[i].Email);
        ite = objs[i].Email;

        if (ite == user_email) {
          console.log("kaya bat hai", ite, user_email);
          res.render('sailor_uplode', { objs, tit1: user_email });
          ite = null;
        }//else{res.render('sailor_uplode.ejs',{objs:null});}
      }
    }
  }
  data2();
  //  })                      
  // res.render('sailor_uplode.ejs',{objs});
  /// console.log(q2.Email);    
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/product_img/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" +
      path.extname(file.originalname));
  }
});
const uplodeprofile = multer({ storage: storage });
app.post("/uplodeprofile", uplodeprofile.single('image_file'), (req, res) => {
  console.log(req.file.filename);

  const myUser = new image_instance({
    Email: user_email,
    product: {
      imagename: req.file.path,
      p_name: req.body.your_dp,
      P_prise: req.body.your_price,
      P_descount: req.body.your_desc,
    },
    img:
    {
      data: fs.readFileSync(path.join(__dirname + '/public/product_img/' + req.file.filename)),
      contentType: 'image/png',
    }

  });
  myUser.save(function (err) {
    console.log("your date is saved", err)
  });

});

app.get(["/contant_page/:id"], function (req, res) {
  const data = async () => {
    const objs = await image_instance.find()
    const tit_id = req.params.id;
    res.render('contant_page', { objs, tit2: tit_id });
  }
  data();

});


app.post("/order_sum", function (req, res) {
   //var a=req.params.p;
   var b=req.body.quantity2;
   var n=req.body.meal2;
   var na=[req.body.meal2];
   var extra=req.body.quantity3;
  console.log(" b= ",n.length,n);
   var objs;
   var bi,a,c=[],gst="18%",total=0,amount=0;
   const data2 = async () => {
    objs = await image_instance.find()
    
     for(var j=0;j<n.length;j++){
        for(var i=0;i<objs.length;i++){
      if(objs[i]._id == n[j]){
        console.log(" b= ",b,n);
          a=parseFloat(objs[i].product.P_prise);
          bi=parseFloat(b[j]);
          c[j]=parseFloat(a*(bi));
          total=parseFloat(total+c[j]);
          console.log("jhjhfgvhj",c[j],total)
        }
      }
     }
     amount=parseFloat(total+(total*18/100));
    // console.log(amount);
    if(amount!=0){     
     res.render('payment_page',{objs,n1:n,b1:b,Extra:extra,sum:c,
    gst:gst,amount:amount});
     }else{
      for(var j=0;j<n.length;j++){
        for(var i=0;i<objs.length;i++){
      if(objs[i]._id == na[j]){
        console.log(" b   na= ",b,na);
          a=parseFloat(objs[i].product.P_prise);
          bi=parseFloat(b[j]);
          c[j]=parseFloat(a*(bi));
          total=parseFloat(total+c[j]);
          console.log("jhjhfgvhj",c[j],total)
        }
      }
     }
     amount=parseFloat(total+(total*18/100));
    // console.log(amount);     
     res.render('payment_page',{objs,n1:na,b1:b,Extra:extra,sum:c,
    gst:gst,amount:amount});
     }
  }
  data2();

});



var template=fs.readFileSync('./views/payment_page.ejs','utf-8');
var completemp=honga.compile(template);


 app.post("/conform_order",isAuth, function (req, res) { 
  console.log("hai i am email");
   var transporter =nodemailer.createTransport({
     service:'gmail',
     auth:{
       user:'linuxk910@gmail.com',
       pass:emailPass,
     }
   });
  
   console.log("aaaaaaaaaaa", req.session.email1);
   var mailOption={
     from: 'linuxk910@gmail.com',
     to: req.session.email1,
     subject:'pawan kumar food app',
     text:'vey vey thanks for your request',
    // html: completemp.render,
   };
   transporter.sendMail(mailOption,function(error,info){
     if(error){
       console.log(error);
     }else{
       console.log("email",info.response);
       alert("you have order sucessfully");
       res.redirect("/contant_page");
     }
   });

});

app.post("/logout",function(req,res){
  console.log("distory method is call");
  req.session.destroy((err)=>{
    if(err)throw err;
    const data = async () => {
      const items = await salior_instance.find()
        res.redirect('/');
    }
    data();
  })
}); 

app.listen(port, function () {
  console.log("server is listining",port);
});