
//Object data modelling library for mongo
const mongoose = require('mongoose');
var moment = require('moment');
//import the request library
var request = require('request');
const axios = require("axios");
//This is the URL endopint of your vm running docker
var url = 'http://192.168.56.30:2375';




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
//var text = d.getFullYear() + ":"+ d.getDate() + ":" + d.getHours()+":" + d.getMinutes();


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
                                      }));
                                   
                                   
                                }, {
                                                noAck: true
                                            });
                });
});

}


setTimeout(function(){a()},5000);

async function save_list(nn){
  var n = await nn;
  var please_work = n.hasOwnProperty('node_delete');
  var please_work_x = n.hasOwnProperty('leader_change');
  console.log("This is what it receive regardingo to the deth node", please_work);

  if (please_work === true){
    console.log("This should work please, :", n.node_delete);
  nodes = nodes.filter(x => x.nodeID !== n.node_delete);
  
  }
  if (please_work_x === true){
    var  changes = n["leader_change"];
    
    console.log("Container change the leader id, :", changes[1], changes[0]);
    (nodes.find(l => l.leader === true )).nodeID = changes[1];   
  }
 
  var ds = new Date();
  //var texts = ds.getFullYear() + ":"+ ds.getDate() + ":" + ds.getHours()+":" + ds.getMinutes();
  nodes_set.add(n["hostname"]);
  

  
  
    if(nodes.some( i => i.nodeID === n["nodeID"]) && nodes.some( i => i.hostname === n["hostname"])){
      console.log("this node should be updated: ", n["nodeID"],"With this time: ",ds );
      (nodes.find(e => e.nodeID === n["nodeID"])).time = ds;    
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
    
    else if(please_work === true){
      console.log("This should work please, :", n.node_delete);
      nodes = nodes.filter(x => x.nodeID !== n.node_delete);
      
    }
   console.log("this are the nodes :", nodes);
   //console.log("this are the nodes :", nodes_set);
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


setInterval(function() {

  console.log("Get the lider whaattt");
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
    console.log("U are on the current leader", toSend);
    var current_leader = leadership();
    // if it is the leader it will check the current nodes, to know if someone is not sending messages.
    check_nodes(current_leader);
  }
  else{
    var current_leader = leadership();
    console.log("Ur ar not on the leader but anyways we should check if the leader has diead")
    check_nodes(current_leader);
  }
}

async function check_nodes(current){
  
  var current_node_time = current.time;
  var dss = new Date();
  var current_date = moment(dss);
  var date_of_leader = moment(current_node_time);
  var diff_leader = current_date.diff(date_of_leader,'minutes');
  if(Math.abs(diff_leader) >=2){
    console.log("this time", dss, "is different from this time", current_node_time, "this is the difference", diff_leader);
    console.log("This would mean that the leader is not receiving messages because a container is dead or the leader itself is dead");
    var please =  await check_leader_status(current["hostname"], current);
    if (please == true){
     
      
      if(nodes.includes(toSend["hostname"])){
        console.log("The node leader is still alive, therefore the time will be updated");
        current.time = dss;
      }else{
        
        console.log("The leader doesn't exist therefore we will delete it");
        toSend.node_delete = leadership().nodeID;
      }
      
    }

    

  }else{
    
    if(nodes.some( h => h.hostname === myhostname) && leadership().hostname == myhostname){
      console.log("The leader has never died therefore we can check the other nodes");
      set_not_alive(current_node_time, current);
    }
    console.log("It seems the leader is still alive so we can continue");
    
  }
  
  
  
  //console.log("Plaese work time");
  
}


function set_not_alive(current_node_time, current){
  var date1 = moment(current_node_time);
  //var time_alive = 0;
  //var container_dead = {}
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
//  if(time_alive >=2){
//    get_container_info(container_dead);
//  }
  if(nodes.some( i => i.status === "dead")){
  console.log("is dead");
  var this_dead = nodes.find(e => e.status === "dead");
  get_container_info(this_dead);
 }

// for(var i=0; i < nodes.length; i ++){
//   if(nodes[i].hasOwnProperty('status')){
//     if(nodes[i].status == "dead"){
//       get_container_info(nodes[i]);
//     }
//   }

// }

}

function get_container_info(container_dead){
  
  
  console.log("this container is or are dead", container_dead)

  console.log("looping again");
  restartContainer(container_dead["hostname"],  container_dead);

}

async function restartContainer(container_id, current_node_checking){
    
    
 // http://192.168.56.40:2375/containers/b380d257868d/json
    try{
  
      let res = await axios.get(`${url}/containers/${container_id}/json`);
      //await axios.post(`http://host.docker.internal:2375/containers/${containerName}/start`);
      var current_status= await res.data.State.Running;
      console.log("THis is the current status if the node was found dead", current_status);
      if(current_status == false){
        console.log("This node is dead", current_status, "This node", current_node_checking );
        await axios.post(`${url}/containers/${container_id}/restart`).then(function(response){
          if(response.status == 204){
            current_node_checking.status = "restart";
            toSend.node_delete = current_node_checking.nodeID;
            console.log("Container restart", current_node_checking);
            console.log("This node was restarted therefore we will need to delete the node from the array");
           
          }
          console.log(response.status)});
      }else{
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



async function check_leader_status(id_host, nodeLeader){
   try{
    let res = await axios.get(`${url}/containers/${id_host}/json`);
    var current_status= await res.data.State.Running;
    console.log("THis is the current status of the leader that is not receiving messages", current_status);
    if(current_status == false){
          var for_change = []
          var new_ids =  await min_algorithm();
          var new_id = await new_ids;
          for_change.push(nodeLeader.nodeID);
          for_change.push(new_id);
          console.log("THis will be the new id", new_id);
          nodeLeader.nodeID = new_id;
          nodeLeader.leader = false;   
          console.log("Container will change the id to be assigned to other one", nodeLeader);
          console.log("Like that other will be the leader");
          toSend.leader_change = for_change;
         
       
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



// a few more lines and the algorithm will be done

// const wait_mins = stop_min => 
//       new Promise(resolve =>     
//         setTimeout(() => resolve(stop_min), 60)
//       );
function wait_min(please_id){
  
  return new Promise((resolve, reject)=>{
    console.log("hopefully is looping", please_id);
    setTimeout(() =>{
      resolve(please_id);
    }, 300);
  });
}

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


// this is the code that I try to run, however I got errors, either it says bad patameter or it create the container and stopped right away
// Image: "alpine", 
// WORKDIR: "/usr/src/app",  
// Volumes: {"/container/path": {}},
// HostConfig: {
//   Binds : ["node1:/usr/src/app/"],
// },
// Cmd: ["echo", "hello world from LJMU cloud computing", "new_container.js"],
//   };

const containerName = "containertest";

const containerDetails = {
  Image: "cloud-coursework_node1",    
  Cmd: ["echo", "hello world from LJMU cloud computing"],
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

  
  // function deploy(){
  //   var now = new Date();
  //   //var deploy_date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0);
  //   console.log("This is the current time for the deply", now);
  //   if (now > new Date (`${now.getDate}` + '22:30:00')){
  //         Console.log("Time to deploy");
  //         createContainer();
  //   }
    
    
  // }
 
  //setInterval(function(){deploy()},2000);
  
  //setTimeout(function(){alert("It's 10am!")}, millisTill10);




 //setTimeout(async function(){createContainer()},9000);


