require('dotenv').config;
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const contactRoute = express.Router()
const nodemailer = require('nodemailer')

let Contact = require('./module.contact')

app.use(cors());
app.use(bodyparser.json());

mongoose.connect('mongodb://127.0.0.1:27017/contactus',{ useNewUrlParser:true})
const connection = mongoose.connection;
connection.once('open',function(){
    console.log("Monogodb database connection established sucessfully")
})

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'process.env.EMAIL',
        pass : 'process.env.PASSWORD'
    }
});

contactRoute.route('/').get(function(req,res){
    Contact.find(function(err,contacts){
        if(err)
        {
            console.log(err);
        } else{
            res.json(contacts);
        }
    })
})

contactRoute.route('/add').post(function(req,res){
    let contactinfo = new Contact(req.body)
    
    contactinfo.save()
               .then(contactinfo => {
               
                let eval = contactinfo.email;
                let mailOptions = {
                    from: 'data.web.development@gmail.com',
                    to: eval,
                    subject: "testing ",
                    text: 'it is working '
                }   

                transporter.sendMail(mailOptions,function(err,data){
                
                    if(err){
                        console.log('error occurs',err);
                    }else {
                        console.log('emailsent !!');
                    }
                });

                   res.send(contactinfo.email)
               }) 
               .catch(err => {
                   res.status(400).send('adding detail failed')
               }) 
})


app.use('/',contactRoute)

app.listen(6688,() =>{
    console.log("server started at http://localhost:6688")
})