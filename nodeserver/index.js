const io = require('socket.io')(8001);
const users = {};
console.log('Node Server Working..');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
const port = process.env.PORT || 8005;
var bodyParser = require('body-parser')
let cors = require("cors");
app.use(cors());
//Add Mysql Server 
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "dbuser",
    password: "pass12345",
    database: "dately_chatapp"
});
con.connect(function(err) {
    if (err) throw err;
    return console.log("Database Connected Successfull.");
});
  


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../index.html'));
});


function getValidUserData(sqlQuery){
    const loginPromise = new Promise((resolve, reject) => {
        var resultArr = [];
        con.query( sqlQuery , function (err, result) {
            if(err) {
                resultArr = [{'status':false, 'message':"Internal Server Error !!"}];
                reject(resultArr)
            } else if (!result.length) {  
                resultArr = [{'status':false, 'message':"Invalid Credentials"}];
                reject(resultArr)
            }else{
                resultArr = [{'status':true, 'message':"User logged successfully.!","data":result[0]}];
                resolve(resultArr);
            }
        });
    });
    return loginPromise;    
}



// Check User Login Method
app.post('/login', function(req, res) {
            var username = req.body.username;
            var credentials = req.body.password;
            var sqlQuery = "SELECT * FROM users where email =" + mysql.escape(username) + " and password = " + mysql.escape(credentials); 
            getValidUserData(sqlQuery).then(data => {
                //console.log(data)
                return res.send(data);
            }).catch(err => {
                console.log(err)
                return res.send(err);
            })
});




app.listen(port);

io.on('connection',socket =>{
    socket.on('new-user-joined',name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('send',message =>{
        socket.broadcast.emit('receive',{message:message, name:users[socket.id]});
    })


    //If User Left the conversation
    socket.on('disconnect',message =>{
            socket.broadcast.emit('left',users[socket.id]);
            delete users[socket.id];
    });
})

console.log('Server started at http://localhost:' + port);
