 6130COMP-Cloud-Coursework

This is a cloud base applicaiton developed during my bachelors studies.


To start this applicaiton you need Ubuntu and Docker installed.

To start the code you need to install the libraries and allow acces to the api. You also need to change the ip addres on the mongo.js file
Cd to the src file where is located mongo.js and inside there run npm install express mongoose amqplib moment dockerode request axios node-schedule
Also set up the adminstrator of rabbit

The best way to visualize the containers logs is with sudo docker-compose up| grep node1. sudo docker-compose up| grep node2. sudo docker-compose up| grep node3

The node leader (container leader) the one that is sending the high id. 

You will check how the nodes are sending messages and they are saved on a list. The list will update the time of the nodes.

If you want to test how to restart a container just sudo kill a container. And then wait for 2 minutes and it should restart the container.

You can also kill the leader node and it will select a new leader and restart the killed node.

Finally at 16:00. It will create a new contanaier. 

For mongo you have to get acces into the mongo root. And there you can save data.
