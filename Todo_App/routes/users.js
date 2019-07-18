const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');



mongoose.connect('mongodb://localhost:27017/todo' , {useNewUrlParser : true});


var usersSchema = new mongoose.Schema({

        first_name : String,
        last_name : String ,
        email : String ,
        password : String ,
        phnno : String ,

        todo : [{
             
            title : String ,
            description : String ,
            deadline : String ,
            status : String

        }]
});

var userModel = mongoose.model('user' , usersSchema);





router.get('/addnew' , (req,res)=> res.render("addnew"));


router.use(bodyparser.urlencoded({extended : true}));

router.use(session({secret : 'deeptanshu' }));

router.get('/login' , (req,res)=> res.render("login"));


router.get('/register' , (req,res)=> res.render("register"));


router.post('/login' , function(req , res){

        var email = req.body.email;
        var password = req.body.password;
        

        userModel.find({$and :[{email : req.body.email},{password : password}] } , function(err , data){
            if(data.length != 0)
            {
                req.session.email = email;
                res.redirect('/users/todo');
                console.log("User Logged In");
            }
            else
            {
                console.log("No account Exits");
                res.redirect("/users/login")
            }
    
        });


});

router.get('/logout' , function(req,res){
    req.session.destroy();
    res.redirect('/users/login');
});

router.get('/todo' , (req,res)=> {
    var email = req.session.email;
    var temp;
    //console.log(email);
    userModel.find({email : email} , function(err , data){
                // console.log(data[0]);
                temp = data[0].todo;
                res.render("todo",{ obj : temp});
        });
    

});

router.get('/completed' , (req,res)=> {
    var email = req.session.email;
    var temp;
    //console.log(email);
    userModel.find({email : email} , function(err , data){
                // console.log(data[0]);
                temp = data[0].todo;
                res.render("completed",{ obj : temp});
        });
    

});


router.post('/register' ,function( req , res ){

    var obj = new userModel({

        first_name : req.body.first_name ,
        last_name : req.body.last_name,
        email : req.body.email ,
        password : req.body.password ,
        phnno : req.body.Phone 
    });
    
    userModel.find({email : req.body.email} , function(err , data){

        if(data.length == 0)
        {
            obj.save();
        }
        else
        {
            console.log("User already exits");
        }

        res.redirect("/users/login")
    });


    res.end();

});

router.post('/update' , function(req , res){

   userModel.findOne({"todo._id" : req.body.objid } , function(err , data){
        var todo = data.todo;
        var temp=[];
       todo.forEach(element => {

            if(element._id == req.body.objid)
            {
                console.log("hiiii");
                element.status = "Completed";
            }
            temp.push(element);

       });
       //console.log(temp);
       userModel.findOneAndUpdate({"todo._id" : req.body.objid}, {$set : {todo : temp}},function(err, doc){
            if(err){
                console.log("Something wrong when updating data!");
            }
         });

    });
    res.redirect('/users/todo');

});

router.post('/addnew' ,function( req , res ){

    var title = req.body.Title;
    var description = req.body.Description;
    var deadline = req.body.Deadline;
    var email = req.session.email;

    var obj = {

             title : title ,
            description : description ,
            deadline : deadline ,
            status : "Pending"
    }
    userModel.find({email : email} , function(err , data){
        data[0].todo.push(obj);
        userModel.findOneAndUpdate({email: email}, {$set : data[0]},function(err, doc){
            if(err){
                console.log("Something wrong when updating data!");
            }
        });

    });
    res.redirect('/users/todo');
    res.end();
});


router.post('/search' , function(req , res){

    var search = req.body.search;

    var email = req.session.email;

    //console.log(search + email);

    userModel.find({email : email} , function(err , data){

        var array = [];

        var temp = data[0].todo;
        temp.forEach(element => {
            
            if(element.title == search)
            {
                var obj = {

                    title : element.title ,
                    description : element.description,
                    deadline : element.deadline,
                    status : element.status
                }

                array.push(obj);
            }


        });
        console.log(array);

        res.render("search",{ obj : array});

    });





});



module.exports = router;