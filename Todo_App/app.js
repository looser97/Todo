const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyparser = require('body-parser');
const app = express();


app.use(expressLayouts);
app.set('view engine' , 'ejs');


app.use('/' , require('./routes/index'));
app.use('/users' , require('./routes/users'));

app.use(bodyparser.urlencoded({extended : true}));

app.post('/user/register' , function( req , res ){

    console.log(req.body);
    res.end();
});

const PORT = process.env.PORT || 5555;

app.listen(PORT , console.log(`server started on ${PORT}`));