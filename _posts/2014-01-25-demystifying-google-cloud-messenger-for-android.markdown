---
layout: post
title: Demystifying Google Cloud Messenger for Android
date: 2014-01-25 22:05:31
comments: true
categories: android
tags:
- vcm
- cloud-messenger 
- push-notifications
disqus: y
share: y
---
_Cloud messenger_ - from the term itself presents an idea of delivering messages to interested parties in the "Cloud". What it particularly means is that we can send messages from our app servers or backend systems to mobile devices without any TCP or connection pain. 

### Big picture of working
![Working diagram of GCM and Devices](https://docs.google.com/drawings/d/1YVUd7bzLGHjiPVK-vyiItKfzygoBkHecH3iKP44M6SM/pub?w=547&h=439)

1. Our system that sends messages to GCM servers. This happens asynchronously. There is an HTTP API available and libraries wrapping around the HTTP API. 
2. Google Cloud Messenger is responsible for queuing and delivering messages to devices based on throttling rules, battery consumption rate, device idle state and network performance. The delivery model of GCM is bit different. This will be further elaborated throughout the post.
3. Devices will receive messages and the operative system invoke the relevant application the message was intended to. For those of who knows Android will know that this is done via an [Intent Broadcast](http://developer.android.com/reference/android/content/BroadcastReceiver.html). 
<!-- more -->
### Sender ID and API key
Since Google provides us this service - we have to login to the Google Console and [create a project](http://developer.android.com/google/gcm/gs.html#create-proj). API key is a static key you get from the console. Sender ID is a bit of complex topic. 

A project can have 100 sender ids - and all these sender ids have to be stated in the client as well. This is useful for a scenario where there are multiple workers sending messages. 

![Example of Multiple Sender IDs in play](https://docs.google.com/drawings/d/1R2jH2Dx_Ass6fXFHG8wOobxsieGZFze4Bsy5PwgglFk/pub?w=860&h=371)

### Enrollment of Devices
When we register a device with GCM for Sender IDs we obtain a Device ID. This Device ID has to be saved in our Backend servers to dispatch messages successfully to devices afterwards. 

### Messaging architecture
When we send a message to a device - GCM place the message in a queue for the Device ID. This temporary queue will hold up to 100 messages. When 100 messages count limit is exceeded - GCM will delete all the messages from the temporary queue and add a message stating ["deleted_messages"](http://developer.android.com/google/gcm/adv.html).

#### Delivering states
We cannot be certain that devices are always online and GCM makes it a top priority to use the battery of devices efficiently. Due to this - immediate dispatch of messages from GCM to Device is not possible. There are several methods to make this disadvantage to an advantage. 

#### Collapse Key
There is another important attribute called _Collapse Key_. For example our Email server sends a message to the device saying that new mail has arrived. In the normal procedure if we send 3 messages saying that email has arrived - the device contacts the  server 3 times. GCM has a method to replace the message as well in the queue. We can setup a collapse key for those types of messages that needs to be replaced. Only one message will be applied if the collapse key is set. But beware only 4 collapse keys are allowed for a project. 

#### Time to live
This flag is set before sending the message to GCM. It specifies when messages are expired. For example if we have a live scoring app (Soccer scores)  we are sending notifications to devices of the current score for matches. We can set it up to discard messages when they are older than a day. 

Important note here is - if you set a message expiration to 0 (meaning now or never) GCM will not throttle that message. It will try it's very best to deliver it. On the other hand GCM will store your messages up to 4 weeks.

#### Delay while idle
If we are sending messages that are of no immediate concern we can set delay while idle flag to true which delays the message if the device is in idle state. 

#### Sending messages with payloads
Apart from messages that asks the device to contact the server, the server can send a payload with the GCM message. This payload is usually a JSON object and the maximum size allowed is 4kb. It's advisable to use these payload messages carefully because there might be scenarios where these messages can be lost. 

The post was rather long but it has many aspects regarding message delivery. I learned about this when I was involved with building the [EMM solution](http://wso2mobile.com/) at WSO2.

