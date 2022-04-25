
//Object data modelling library for mongo
const mongoose = require('mongoose');
var moment = require('moment');
//import the request library
var request = require('request');
const axios = require("axios");
//This is the URL endopint of your vm running docker
var url = 'http://192.168.56.15:2375';
const schedule = require('node-schedule');




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
const { Console } = require('console');
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
  employeeModel.find({},'get data', (err, employee) => {
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

// This will create a random ID for each node
var nodeID= Math.floor(Math.random() * (100 - 1 + 1) + 1);
// We can start an instance of the current data
var d = new Date();
//var text = d.getFullYear() + ":"+ d.getDate() + ":" + d.getHours()+":" + d.getMinutes();

//This is the message that the nodes will send.
toSend = {"hostname": myhostname, "time": d, "nodeID": nodeID};




// This is the publishet method that will send messages to the sub method

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

// This is the sub methods, it is an async function, therefore it will wait until it receive the message

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
                                    
                                 
                                    //This will send the message to the function save_list
                                    // I have make it be a promise, in order to wait until the message is parsed into an Json object
                                      save_list(new Promise(resolve =>{
                                        console.log("loading nodes")
                                        resolve(JSON.parse(m));   
                                      }));
                                    
                                      
                                   
                                   
                                }, {
                                                noAck: true
                                            });
                });
});

}


setTimeout(function(){a()},5000);

//This is the method that will save the nodes
async function save_list(nn){
  
  //First of all we need to wait to the object.
  var n = await nn;
  //With this variables we are going to check if the messages has send a  new attribute
  //This attributes are the ones that will say which node has to be deleted and to change the leader id
  var deleteNodes = n.hasOwnProperty('node_delete');
  var change_Leader_Id = n.hasOwnProperty('new_leader_id');
  
  
  
  console.log("This is what it receive regarding to the deth node", deleteNodes);
  //With this we are going to check if the new container has started. And if it is not inside the array we are going to puhs it
  if(n.hostname == "nodejscluster_node1_4" && !nodes.includes(n["hostname"]) ){
    if(nodes.length < 4){
      nodes.push(n);
    }    
    
  }
  
  
  //This will check if you have to delete a node.
  if (deleteNodes === true){
    //If you have to change the leader id, this condition will change it
    if(change_Leader_Id === true){
         if(leadership().nodeID == n.node_delete){
          console.log("Change id");
          (nodes.find(e => e.leader === true)).nodeID = n.new_leader_id;
          //otherwise we are going to delete it
         }else{
          console.log("This node will be deleted, :", n.node_delete);
            nodes = nodes.filter(x => x.nodeID !== n.node_delete);
          
         }
      //   Here we are going to also delete the node from the array. 
    }else{
      console.log("The node will be deleted from the array, :", n.node_delete);
      nodes = nodes.filter(x => x.nodeID !== n.node_delete);
    }
    
   
  
  }
 
  
 // get the current time
  var ds = new Date();
  //var texts = ds.getFullYear() + ":"+ ds.getDate() + ":" + ds.getHours()+":" + ds.getMinutes();
  

  
    // check if the node node, exits and if it does we are going to update it
    if(nodes.some( i => i.nodeID === n["nodeID"]) && nodes.some( i => i.hostname === n["hostname"])){
      console.log("this node should be updated: ", n["nodeID"],"With this time: ",ds );
      (nodes.find(e => e.nodeID === n["nodeID"])).time = ds;    
     }
      // otherwise we are going to push it
     else if(nodes.length < 3){
      
      if(!nodes.includes(n["hostname"]) ){
      if(!nodes.includes(n["nodeID"])){
      //this is just to check if the node already exits, and to be sure if we can push it
      if(check_duplicate(n) == false){
        nodes.push(n);
      }
      }
    }
     
     }
     // This is just to make sure that we are deleting the nodes from the array of the leader
     else if(nodes.some( r => r.status === "restart")){
       console.log("An container inside the id was deleted therefore we need to delete it from the array");
       var deleted = nodes.find(d => d.status === "restart");
       console.log("this node was remove:", deleted);
       nodes = nodes.filter(x => x.status !== "restart" );
       


     }

     else if(nodes.some( m => m.status === "noNode")){
      console.log("An container inside the the array is not receiving messages, so it is possible that there is a problem in the array");
      console.log("So is better if we deleted");
      var deleted = nodes.find(d => d.status === "noNode");
      console.log("this node was remove:", deleted);
      nodes = nodes.filter(x => x.status !== "noNode");
      
    }

   console.log("this are the nodes :", nodes);
  
}


function check_duplicate(n){
  console.log("this should check is something is duplicate");
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

// get the highest id
function leadership(){
var max = nodes[0];
for(var i = 0; i < nodes.length; i++ ){
  if(max.nodeID < nodes[i].nodeID){
    max = nodes[i];
  }
}
return max; 
}

// get the leader
setInterval(function() {

  console.log("Get the lider");
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
  //check if you are on the current hostname and if you are the leader
  if(nodes.some( h => h.hostname === myhostname) && leadership().hostname == myhostname ){
    console.log("You are on the current leader", toSend);
    var current_leader = leadership();
    // if it is the leader it will check the current nodes, to know if someone is not sending messages.
    check_nodes(current_leader);
  }
  else{
    // We anyways need to check if the leader is dead or not
    var current_leader = leadership();
    console.log("Your ar not on the leader but anyways we should check if the leader has diead")
    check_nodes(current_leader);
  }
}

async function check_nodes(current){
  // With this we are going to substract the current time again the time of the leader
  var current_node_time = current.time;
  var dss = new Date();
  var current_date = moment(dss);
  var date_of_leader = moment(current_node_time);
  var diff_leader = current_date.diff(date_of_leader,'minutes');
  // If the difference is more that 2, we need to check the status of the leader
  if(Math.abs(diff_leader) >=2){
    console.log("this time", dss, "is different from this time", current_node_time, "this is the difference", diff_leader);
    console.log("This would mean that the leader is not receiving messages because a container is dead or the leader itself is dead");
    //Await to check the the leader
    var leader_checking =  await check_leader_status(current["hostname"], current);
    if (leader_checking == true){
       // if it is still alive we are going to update it
      if(nodes.some( i => i.hostname === toSend["hostname"]))
      {
        console.log("The node leader is still alive, therefore the time will be updated");
        current.time = dss;
      }else{
        // otherwise we have to delete, because maybe there is an error on the array
        console.log("The leader doesn't exist therefore we will delete it");
        toSend.node_delete = leadership().nodeID;
      }
      
    }

    

  }else{
    // The leader never die
    if(nodes.some( h => h.hostname === myhostname) && leadership().hostname == myhostname){
      console.log("The leader has never died therefore we can check the other nodes");
      set_not_alive(current_node_time, current);
    }
    console.log("It seems the leader is still alive so we can continue");
    
  }
  
  
  
  //console.log("Plaese work time");
  
}


function set_not_alive(current_node_time, current){
  // Compare the difference of each node and update their status.
  var date1 = moment(current_node_time);
  nodes.forEach((i) =>{
    var date2 = moment(i.time);
    var diff = date1.diff(date2,'minutes');
    console.log("This node", i.nodeID, "this is the difference", diff, "this are the compared with leader", current.nodeID);
    time_alive = diff;
    container_dead = i;
    if(Math.abs(diff) >=2){
      i.status = "dead";
    }
    else if(Math.abs(diff) >=5){
      i.status = "noNode";
      toSend.node_delete = i.nodeID;
    }
  })
// Check with node is dead and execute a new function.
  if(nodes.some( i => i.status === "dead")){
  console.log("is dead");
  var this_dead = nodes.find(e => e.status === "dead");
  get_container_info(this_dead);
 }


}

function get_container_info(container_dead){
  
  
  console.log("this container is dead", container_dead)

  console.log("looping again");
  // pass the node and the hostname
  restartContainer(container_dead["hostname"],  container_dead);

}

async function restartContainer(container_id, current_node_checking){
    
    
 
    try{
     // First I want to check the status of the node
      let res = await axios.get(`${url}/containers/${container_id}/json`);
     // If the status is false that will mean that the container is dead
      var current_status= await res.data.State.Running;
      console.log("THis is the current status if the node was found dead", current_status);
      if(current_status == false){
        console.log("This node is dead", current_status, "This node", current_node_checking );
        // restart the node
        await axios.post(`${url}/containers/${container_id}/restart`).then(function(response){
          // If the request was a succes we have to change the status and send a message with the toSend object to the other nodes
          // SO it will be delete it from the array
          if(response.status == 204){
            current_node_checking.status = "restart";
            toSend.node_delete = current_node_checking.nodeID;
            console.log("Container restart", current_node_checking);
            console.log("This node was restarted therefore we will need to delete the node from the array");
           
          }
          console.log(response.status)});
      }else{
        // If the node is not dead we will change the status. And with recursion we are going to check other nodes that maybe dead
        console.log("This container is not receving messages however is not dead", current_node_checking);
        current_node_checking.status = "alive";
        console.log("This is not dead", current_node_checking);
        console.log("if we have another node that is with status dead with a recursive call we will restart it");
        if(nodes.some( i => i.status === "dead")){
          console.log("other node that is dead");
          var second_dead = nodes.find(e => e.status === "dead");
          return restartContainer(second_dead["hostname"],second_dead);
         }
      }
    }
    catch(error)
    {
        console.log(error);
    }
       
}

//THis will check the status of the leader
//If it is dead we are going to change the id to the lowest id and like that a new leader will be selected

async function check_leader_status(id_host, nodeLeader){
   try{
    let res = await axios.get(`${url}/containers/${id_host}/json`);
    var current_status= await res.data.State.Running;
    console.log("THis is the current status of the leader that is not receiving messages", current_status);
    if(current_status == false){
          var save_id = nodeLeader.nodeID;
          var new_ids =  await min_algorithm();
          var new_id = await new_ids;
          
          console.log("THis will be the new id", new_id);
          nodeLeader.nodeID = new_id;
          nodeLeader.leader = false;
          toSend.node_delete = save_id;
          toSend.new_leader_id = new_id   
          console.log("Container will change the id to be assigned to other one", nodeLeader);
          console.log("Like that other will be the leader");
         
         
       
        return false
    }
    else
    {
      return true
    }
   }
   catch(error)
   {
     console.log(error);
   }
}




function wait_min(please_id){
  
  return new Promise((resolve, reject)=>{
    console.log("looping ", please_id);
    setTimeout(() =>{
      resolve(please_id);
    }, 300);
  });
}
 // With this we are going to get the lowest Id and decresed to assigened to the dead leader
 // I use an async function with promises, so like that we are going to wait to the container
 async function min_algorithm(){
   var mins = nodes[0];
   var min = nodes[0].nodeID;
   console.log("This is first value to loop", mins);
   console.log("This is the id", min);
   nodes.forEach(async (item) =>{ 
    console.log("Please loop here");
    var min_please= await wait_min(item.nodeID);
    console.log("Check if this pass");
    if(min_please < min){
      console.log("Check if is waiting condition");
      min = await min_please;
      console.log("Thhis is the new min", min);
    } else{
      console.log("Condition not satified");
    } 
   })
   return new Promise((resolve, reject) =>{
    setTimeout(() =>{
      resolve(min - 1);
    }, 1050); 
   })
   
   }


// With this we are going to set the variables of the containers
const containerName = "containertest";

const containerDetails = {
  Image: "cloud-coursework_node1",    
  Hostname: "nodejscluster_node1_4",
  NetworkingConfig: {
    EndpointsConfig: {
      "cloud-coursework_default": {},
    },
  },
    };

   



async function createContainer(){
  
  console.log("It should create a container")
  try{
          // let res_check = await axios.get(`${url}/containers/${containerName}/json`).catch(function(err){console.log(err)});
          // console.log("Debuggin", res_check);  
          //if (res_check == null){

            
            await axios.post(`${url}/containers/create?name=${containerName}`, containerDetails).then(function(response){console.log(response.data)});
          //}
            await axios.post(`${url}/containers/${containerName}/start`).then(function(response){console.log("This is the status", response.data)});
            //await axios.get(`${url}/containers/${containerName}/logs`).then(function(response){console.log("This is the status logs", response.data)});
           
          //clearInterval(id_set_please);
          console.log("Check if it works");
          
      }
      catch(error)
      {
          console.log(error);
      }
  }
   // With this libraty we are going to create a container at 4:00 pm
  const rule = new schedule.RecurrenceRule();
  rule.hour = 16;
  rule.minute = 00;
  
  
  const job = schedule.scheduleJob(rule, function(){
    createContainer();
  });

// if(leadership().hostname == myhostname){
//   job;
// }
job;

 //setTimeout(async function(){createContainer()},30000);


