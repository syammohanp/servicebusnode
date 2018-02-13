//console.log('Itsdvvfkkfmg');
//https://www.npmjs.com/package/azure-service-bus-client
//https://www.npmjs.com/package/servicebus
//https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-nodejs-how-to-use-topics-subscriptions
//https://dzone.com/articles/nodejs-azure-web-sites-and
//https://github.com/Azure/azure-sdk-for-node/blob/master/examples/ASM/service-bus.md

//var azure = require('azure-sb');
var azure = require('azure');

function checkForMessages(sbService, queueName, callback) {
  sbService.receiveQueueMessage(queueName, { isPeekLock: true }, function (err, lockedMessage) {
    if (err) {
      if (err === 'No messages to receive') {
        console.log('No messages');
      } else {
        callback(err);
      }
    } else {
      callback(null, lockedMessage);
    }
  });
}

function checkMessageCount(sbService, queueName){
    sbService.getQueue(queueName, function(err, queue){
        if (err) {
            console.log('Error on get queue length: ', err);
        } else {
            // length of queue (active messages ready to read)
            var length = queue.CountDetails['d2p1:ActiveMessageCount'];
            console.log(length + ' messages currently in the queue');
            return length;
        }
    });
}

function processMessage(sbService, err, lockedMsg) {
  if (err) {
    console.log('Error on Rx: ', err);
  } else {
    console.log('Rx: ', lockedMsg);
    sbService.deleteMessage(lockedMsg, function(err2) {
      if (err2) {
        console.log('Failed to delete message: ', err2);
      } else {
        console.log('Deleted message.');
      }
    })
  }
}

var idx = 0;
function sendMessages(sbService, queueName) {
  var msg = 'Message # ' + (++idx);
  sbService.sendQueueMessage(queueName, msg, function (err) {
   if (err) {
     console.log('Failed Tx: ', err);
   } else {
     console.log('Sent ' + msg);
   }
  });
}

 //Get details on a queue from the queue object
    function getQueue(sbService, queueName){
        sbService.getQueue(queueName, function(err, queue){
        if (err) {
            console.log('Error on get queue: ', err);
        } else {
            console.log(queue);
            return queue;
		}
        });
    }

var connStr = 'Endpoint=sb://syamtest.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=0WC6atQr21Z4mPkbDpO33SLu9HNUvUMD4oZivRWN8lY=';
if (!connStr) throw new Error('Must provide connection string');
var queueName = 'sbqtest1';

console.log('Connecting to ' + connStr + ' queue ' + queueName);
var sbService = azure.createServiceBusService(connStr);
sbService.createQueueIfNotExists(queueName, function (err) {
  if (err) {
   console.log('Failed to create queue: ', err);
  } else {
   setInterval(checkForMessages.bind(null, sbService, queueName, processMessage.bind(null, sbService)), 5000);
   setInterval(sendMessages.bind(null, sbService, queueName), 1000);
   setInterval(checkMessageCount.bind(null, sbService, queueName), 2000);
   //setInterval(getQueue.bind(null, sbService, queueName), 6000);
  }
});











/*
//Second part
//https://weblogs.asp.net/shijuvarghese/pub-sub-in-node-js-apps-using-azure-service-bus-topics
var azure = require('azure');
//var config=require('./config');
var serviceBusClient = azure.createServiceBusService(
    'Endpoint=sb://syamtest.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=0WC6atQr21Z4mPkbDpO33SLu9HNUvUMD4oZivRWN8lY=');

    var topic = 'orders';
    function createTopic() {
        //Create topic
        serviceBusClient.createTopicIfNotExists(topic, 
    function (error) {
            if(!error){
                console.log('Topic created or exists.');
            }
        });
    }


    function createSubscription(subscriber) {
        // Create subscription
        serviceBusClient.createSubscription(topic, subscriber,
         function (error) {
                if (error) {
                    console.log(error);
                }
                else
                {
                    console.log('Subscriber '+ subscriber+ ' registered for '+ topic+ ' messages');
                }
            });
        }

        var subscription1 = 'supplier1';
        var subscription2 = 'supplier2';
         
        createSubscription(subscription1);
        createSubscription(subscription2);

        function sendMessage(message) {
            // Send messages for subscribers
            serviceBusClient.sendTopicMessage(topic, message, 
           function(error) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Message sent');
                }
            });
        }

        var orderMessage1={"OrderId":101,
        "OrderDate": new Date().toDateString()};
        sendMessage(JSON.stringify(orderMessage1));
        var orderMessage2={"OrderId":102,
        "OrderDate": new Date().toDateString()};
        sendMessage(JSON.stringify(orderMessage2));

        function receiveMessages(subscriber) {
            // Receive the messages for subscription.
            serviceBusClient.receiveSubscriptionMessage(topic, subscriber,
         function (error1, message1) {
                if (error1) {
                    console.log(error1);
                } else {
                    var topicMessage1 = JSON.parse(message1.body);
                    console.log('Processing Order# ' + topicMessage1.OrderId
                        + ' placed on ' + topicMessage1.OrderDate+ ' from ' + subscriber);
                    //call for receive next message
                    serviceBusClient.receiveSubscriptionMessage(topic, subscriber,
              function (error2, message2) {
                        if (error2) {
                            console.log(error2);
                        } else {
                            var topicMessage2 = JSON.parse(message2.body);
                            console.log('Processing Order# ' + topicMessage2.OrderId
                                + ' placed on ' + topicMessage1.OrderDate+ ' from ' + subscriber);
                        }
                    });
                }
            });
        }

        receiveMessages(subscription1);
        receiveMessages(subscription2);
        
    */