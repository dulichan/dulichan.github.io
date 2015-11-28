---
layout: post
title: Conference for Internet of Things- SolidCon
date: 2014-05-23 12:16:20 
comments: true
categories: iot
tags:
- wso2
- architecture
- conference
disqus: y
share: y
---

This week, my colleagues and I were present at the O'Reilly SolidCon- an amazing conference that focused about Hardware and Software that brought forward the 'Maker's attitude'. First day kicked off with an exciting keynote on how robots will live, work and operate side by side with humans in the future([Baxter robot](http://www.rethinkrobotics.com/products/baxter/)). Contrary to the many sci-fi movies, Baxter was quite safe to operate and very friendly. Baxter can be programmed using a graphical user interface. I had a go with it - by programming it to pickup a ball from one end of a line to another. 

WSO2 presented a reference architecture for Internet of Things that focused on the requirements of IoT devices. We broke down the requirements of IoT devices into the below key categories -

* Connectivity and communications
* Device Management
* Data collection, analysis, and actuation
* Scalability
* Security

Paul Fremantle, Co-founder & CTO of WSO2 wrote a white paper about the reference architecture which you can find on our [website](http://wso2.com/whitepapers/a-reference-architecture-for-the-internet-of-things/). The white paper also has the mapping of WSO2 products to the bits and pieces of the reference architecture.

![Reference Architecture for IoT](http://i.imgur.com/0enT8Ko.png)

<!-- more -->


Our demonstration at the conference was an example of the reference architecture. There was one RaspberryPi that was connected to the Internet that pushed MQTT messages of the temperature of the conference hall. A Complex Event Processing server ran in the cloud performing realtime stream data analysis. If the temperature of the conference hall went beyond 30 C - the Complex Event Processing server sent an MQTT message to another RaspberryPi connected to the cloud which switched on the Fan once an MQTT message was received.

![Reference Architecture for IoT with WSO2 Products](http://i.imgur.com/PU51yjW.png)

The [WSO2 Enterprise Mobility Manager](http://wso2.com/products/enterprise-mobility-manager/) product was improved to manage IoT devices (RaspberryPi's in this scenario). An Agent software in the RaspberryPi contacts the EMM server periodically. The EMM server can perform operations on the actuators and view the data off the sensors. In this case - EMM server can view the temperature data on the screen and operate the fan of the RaspberryPi as well.

![The demonstration of the Internet of Things reference architecture](http://i.imgur.com/DCY9cRz.jpg)

Paul also conducted a talk at the Solid Conference about Security of IoT devices. It was a quite interesting talk that discussed why security is an all-important aspect for IoT devices since they are inside the perimeter of our privacy. 

![Paul giving his talk](http://i.imgur.com/q1JQtWx.jpg)

Overall, it was great being part of the event and I would love to attend SolidCon next year as well- especially since it's a great place to meet hardware and software geeks and see a lot of interesting innovations in both categories. 

![Me describing about the demo to a customer](http://i.imgur.com/Czwk4gM.jpg)