
//Object data modelling library for mongo
const mongoose = require('mongoose');
var moment = require('moment');
//import the request library
var request = require('request');
const axios = require("axios");
//This is the URL endopint of your vm running docker
var url = 'http://192.168.56.40:2375';




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
let nodes_set = new Set();

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
  nodes_set.add(n["hostname"]);
  

  
  
    if(nodes.some( i => i.nodeID === n["nodeID"]) && nodes.some( i => i.hostname === n["hostname"])){
      console.log("this node should be updated", ds );
      (nodes.find(e => e.nodeID === n["nodeID"])).time = ds;

      //createContainer(n["hostname"]);
    
     }
   
 
     else if(nodes.length < 3){
      
      if(!nodes.includes(n["hostname"]) ){
      if(!nodes.includes(n["nodeID"])){
      
      if(check_duplicate(n) == false){
        nodes.push(n);
      }
      }
    }
     
     }
   

   console.log("this are the nodes :", nodes);
   console.log("this are the nodes :", nodes_set);


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
  
  set_not_alive(current_node_time, current);
  console.log("this is the time of the node that may be dead", current_node_time);
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

function set_not_alive(current_node_time, current){
  var date1 = moment(current_node_time);
  var time_alive = 0;
  var container_dead = {}
  nodes.forEach((i) =>{
    var date2 = moment(i.time);
    var diff = date1.diff(date2,'minutes');
    console.log("element", i.nodeID, "this is the different", diff, "this are the compared");
    time_alive = diff;
    container_dead = i;
    if(diff >=2){
      i.status = "dead";
    }
  })
 if(time_alive >=2){
   get_container_info(container_dead);
 }
 else if(nodes.some( i => i.status === "dead")){
  console.log("is dead");
  var this_dead = nodes.find(e => e.status === "dead");
  get_container_info(this_dead);
 }

}

function get_container_info(container_dead){
  
  
  console.log("this container is dead", container_dead)

  restartContainer(container_dead["hostname"]);

}

async function restartContainer(container_id){
  
 // http://192.168.56.40:2375/containers/b380d257868d/json
    try{
  
      let res = await axios.get(`${url}/containers/${container_id}/json`);
      //await axios.post(`http://host.docker.internal:2375/containers/${containerName}/start`);
      var current_status= res.data.State.Running
      if(current_status == false){
        console.log("This node is dead", current_status);
        await axios.post(`${url}/containers/${container_id}/restart`).then(function(response){console.log(response.status)});
      }
    }
    catch(error)
    {
        console.log(error);
    }
       
}


const containerName = "containertest";

const containerDetails = {
  Image: "alpine",    
  WORKDIR: "/usr/src/app",  
  Cmd: ["echo", "hello world from LJMU cloud computing"],
    };

async function createContainer(){
  
  console.log("If this work I almost have everything")
  try{
          let res_check = await axios.get(`${url}/containers/${containerName}/json`).catch(function(err){console.log(err)});
          console.log("Debuggin", res_check.data.status);  
          if (res_check.status != 200){

            
            await axios.post(`${url}/containers/create?name=${containerName}`, containerDetails).then(function(response){console.log(response.data)});
            await axios.post(`${url}/containers/${containerName}/start`).then(function(response){console.log("This is the status", response.data)});
            await axios.get(`${url}/containers/${containerName}/logs`).then(function(response){console.log("This is the status logs", response.data)});
            }
          clearInterval(id_set_please);
          console.log("Plesssssssssssssssssssss");
          
      }
      catch(error)
      {
          console.log(error);
      }
  }


var id_set_please = setTimeout(async function(){createContainer()},20000);


