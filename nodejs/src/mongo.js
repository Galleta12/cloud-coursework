
//Object data modelling library for mongo
const mongoose = require('mongoose');
var moment = require('moment');

//Mongo db client library
//const MongoClient  = require('mongodb');

//Express web service library
const express = require('express')

//used to parse the server response from json to object.
const bodyParser = require('body-parser');



//instance of express and port to use for inbound connections.
const app = express()
const port = 3000

var os = require("os");
const { resolve } = require('path');
var myhostname = os.hostname();

//connection string listing the mongo servers. This is an alternative to using a load balancer. THIS SHOULD BE DISCUSSED IN YOUR ASSIGNMENT.
const connectionString = 'mongodb://localmongo1:27017,localmongo2:27017,localmongo3:27017/NotFLIX?replicaSet=rs0';

setInterval(function() {

  console.log(`Intervals are used to fire a function for the lifetime of an application.`);

}, 3000);

let nodes= [];

systemLeader = false;
//tell express to use the body parser. Note - This function was built into express but then moved to a seperate package.
app.use(bodyParser.json());

//connect to the cluster
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var employeeSchema = new Schema({
  _id: Number,
  userName: String,
  title_id: Number,
  userAction: String,
  point_interaction: String,
  type_interaction: Number,
  date_time: Date
});

var employeeModel = mongoose.model('Employee', employeeSchema, 'Employee');



app.get('/', (req, res) => {
  employeeModel.find({},'item price quantity lastName', (err, employee) => {
    if(err) return handleError(err);
    res.send(JSON.stringify(employee))
  }) 
})

app.post('/',  (req, res) => {
  var awesome_instance = new SomeModel(req.body);
  awesome_instance.save(function (err) {
  if (err) res.send('Error');
    res.send(JSON.stringify(req.body))
  });
})

app.put('/',  (req, res) => {
  res.send('Got a PUT request at /')
})

app.delete('/',  (req, res) => {
  res.send('Got a DELETE request at /')
})

//bind the express web service to the port specified
app.listen(port, () => {
 console.log(`Express Application listening at port ` + port)
})


var nodeID= Math.floor(Math.random() * (100 - 1 + 1) + 1);

var d = new Date();
var text = d.getFullYear() + ":"+ d.getDate() + ":" + d.getHours()+":" + d.getMinutes();


toSend = {"hostname": myhostname, "time": d, "nodeID": nodeID};






setInterval(function() {

var amqp = require('amqplib/callback_api');


amqp.connect('amqp://test:test@cloud-coursework_haproxy_1', function(error0, connection) {
      if (error0) {
              throw error0;
            }
      connection.createChannel(function(error1, channel) {
              if (error1) {
                        throw error1;
                      }
              var queue = 'hello';
              var msg = 'Hello world';

              channel.assertQueue(queue, {
                        durable: false
                      });

              //channel.sendToQueue(queue, Buffer.from(msg));
              channel.sendToQueue(queue, Buffer.from(JSON.stringify(toSend)));
              console.log(" [x] Sent %s", JSON.stringify(toSend));
             
            });
    setTimeout(function() {
              connection.close();
              //process.exit(0)
              }, 500);
});

}, 1000);

function a(){

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://test:test@cloud-coursework_haproxy_1', function(error0, connection) {
        if (error0) {
                    throw error0;
                }
        connection.createChannel(function(error1, channel) {
                    if (error1) {
                                    throw error1;
                                }

                    var queue = 'hello';

                    channel.assertQueue(queue, {
                                    durable: false
                                });

                    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

                    channel.consume(queue, function(msg) {
                                    console.log(" [x] Received %s", msg.content.toString());
                                    var m = msg.content.toString();
                                    
                                    save_list(new Promise(resolve =>{
                                      console.log("loading nodes")
                                      resolve(JSON.parse(m));   
                                    }
                                      ));
                                }, {
                                                noAck: true
                                            });
                });
});

}


// function publisher(){
//   return new Promise(resolve => {
    
//   });
// }


setTimeout(function(){a()},5000);

async function save_list(nn){
  var n = await nn;
  var ds = new Date();
  var texts = ds.getFullYear() + ":"+ ds.getDate() + ":" + ds.getHours()+":" + ds.getMinutes();

  
  if(nodes.some( i => i.nodeID === n["nodeID"]) && nodes.some( i => i.hostname === n["hostname"])){
    (nodes.find(e => e.nodeID === n["nodeID"])).time = ds;
 
   }
     else  {
      
      if(!nodes.includes(n["hostname"]) ){
      if(!nodes.includes(n["nodeID"])){
      
      if(check_duplicate(n) == false){
        nodes.push(n);
      }
      }
    }
     
    }
   

   console.log("this are the nodes :", nodes);


}

// }

function check_duplicate(n){
  console.log("this remove duplicate");
  var checker = false;
  
  if(typeof nodes !== 'undefined'){
  for (var i=0; i < nodes.length; i++) {
    if (nodes[i].hostname === n["hostname"]) {
        checker = true;
    }
    checker = false;
}
  }else{
    checker = false;
  }

return checker
  
}


function leadership(){
var max = nodes[0];
for(var i = 0; i < nodes.length; i++ ){
  if(max.nodeID < nodes[i].nodeID){
    max = nodes[i];
  }
}
return max; 
}


setInterval(function() {

  console.log("what");
  //console.log(toSend.nodeID);
  //console.log("this is the leader", leadership());
  console.log("this is the leader in the list of nodes", leadership());
  for(var i = 0; i < nodes.length; i++ ){
    if(leadership() === nodes[i]){
      nodes[i].leader = true;
      
    }else{
      nodes[i].leader = false;
      
    }
  }

this_leader();

  

 
}, 8000);

function this_leader(){
 
  
  if(nodes.some( h => h.hostname === myhostname) && leadership().hostname == myhostname ){
  
    console.log("U are on the current leader", toSend);
    current_leader = leadership();
    check_nodes(current_leader);


  }
}

function check_nodes(current){
  
  //var dss = new Date();
  var current_node_time = current.time;
  //var date1 = moment(current_node_time);
  //var date2 = moment(dss);
  //var diff = date2.diff(date1,'minutes');
  //var test_alive = await check_alive(current_node_time)
  
  
  console.log("this is the time of the node that may be dead", test_alive);
  console.log("Plaese work time");
  
}

function check_alive(current_node_time){
  var date1 = moment(current_node_time);  
  console.log("I hope this is looping");
  return new Promise((resolve,reject) =>{
    nodes.forEach((i) =>{
      var date2 = moment(i.time);
      var diff = date1.diff(date2,'minutes');
      if(diff == 2){
        resolve(i);
      }else{
        reject("error")
      }
    })
  });

}

function set_not_alive(current_node_time){
  var date1 = moment(current_node_time);
  nodes.forEach((i) =>{
    var date2 = moment(i.time);
    var diff = date1.diff(date2,'minutes');
    console.log("element", i.nodeID, "this is the different", diff, "this are the compared", date1, ":", date2);

  })


}