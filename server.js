const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const contactRoute = express.Router()

let Contact = require('./module.contact')

app.use(cors());
app.use(bodyparser.json());

mongoose.connect('mongodb://127.0.0.1:27017/contactus',{ useNewUrlParser:true})
const connection = mongoose.connection;
connection.once('open',function(){
    console.log("Monogodb database connection established sucessfully")
})
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
                const nodemailer = require("nodemailer");

                // async..await is not allowed in global scope, must use a wrapper
                async function main() {
                  // Generate test SMTP service account from ethereal.email
                  // Only needed if you don't have a real mail account for testing
                  let testAccount = await nodemailer.createTestAccount();
                
                  // create reusable transporter object using the default SMTP transport
                  let transporter = nodemailer.createTransport({
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                      user: testAccount.user, // generated ethereal user
                      pass: testAccount.pass, // generated ethereal password
                    },
                  });
                
                  // send mail with defined transport object
                  let info = await transporter.sendMail({
                    from: '"Fred Foo 👻" <foo@example.com>', // sender address
                    to: "bar@example.com, baz@example.com", // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: "Hello world?", // plain text body
                    html: "<b>Hello world?</b>", // html body
                  });
                
                  console.log("Message sent: %s", info.messageId);
                  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                
                  // Preview only available when sending through an Ethereal account
                  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                }
                
                main().catch(console.error);
                   res.status(200).json({'contactinfo' :'contact info added sucessfully' })
               }) 
               .catch(err => {
                   res.status(400).send('adding detail failed')
               }) 
})


app.use('/contact',contactRoute)

app.listen(6789,() =>{
    console.log("server started at http://localhost:6789")
})