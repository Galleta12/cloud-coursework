 6130COMP-Cloud-Coursework





To start the code you need to install the libraries and allow acces to the api. You also need to change the ip addres on the mongo.js file
Cd to the src file where is located mongo.js and inside there run npm install express mongoose amqplib moment dockerode request axios node-schedule
Also set up the adminstrator of rabbit

The best way to thes the work is with sudo docker-compose up| grep node1. sudo docker-compose up| grep node2. sudo docker-compose up| grep node3

You need to be on the tab what is displaying the node leader the one that is sending the high id. In order to see the functionalities.

You will check how the nodes are sending messages and their are saved on a list. The list will update the time of the nodes.
If you want to test how to restart a container just sudo kill a container. And then wait for 2 minutes and it should restart the container.
You can also kill the leader node and it will select a new leader and restart the killed node.

Finally at 16:00 (on linux it is one hour before of the current time). It will create a new contanaier. Unfortunalety I am not able to remove this container.

For mongo you have to get acces into the mongo root. And there you can save data.
