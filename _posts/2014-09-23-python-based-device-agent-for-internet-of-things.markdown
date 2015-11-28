---
layout: post
title: Python based Device Agent for Internet of Things
date: 2014-09-23 05:32:03 +0530
comments: true
categories: iot
tags:
- python
- wso2
- device-management
disqus: y
share: y
---
Once we have all the backend infrastructure ready with Event Collection, Device Management etc etc - we need a Device Agent to connect the actual device with the aforementioned infastructure. I have embedded the [RA diagram](http://wso2.com/whitepapers/a-reference-architecture-for-the-internet-of-things/) below to refresh our thoughts.

{% img center http://i.imgur.com/0enT8Ko.png Reference Architecture for IoT %} 

After thinking for a while - I got a feeling that there are 2 types of things that the agent does. 

* Device Management Agent
* Activity Agent

<!-- more -->
## Device Management Agent
DM Agent is a generic component set that provide Device Management and utilities. For an example, DM Agent provides -

* Communication adaptors for MQTT, HTTP
* Device Enrollment
* Token Management
* Management for platform type

## Activity Agent
​Activity Agent is a framework that allows developers to plugin custom Publishers and APIs. The framework can load the Publishers periodically and publish data using communication wrappers (provided from the framework). In a real world example - this is a temperature sensor publishing data to an API. 

The framework can expose custom API classes using MQTT / HTTP API wrapper. This allows external invocation of Hardware APIs via the wrapper. A Buzzer connected to a Raspberry Pi exposed as an API is the ideal example. 


The White Paper by WSO2 on the <a href="http://wso2.com/whitepapers/a-reference-architecture-for-the-internet-of-things/">Reference Architecture for the Internet of Things</a> explains all the components in IoT and give details on implementation of different components. The RA diagram was taken from it.

## Architecture of the Agent
It would help to see the components of the Device Agent stacked together to better understand the agent architecture. 

{% img center http://i.imgur.com/U3NqPLV.png Architecture of the Python Agent %} 

Before - I took an example of a Temperature sensor and a Buzzer actuator. Let's connect those to a RaspberryPi and see what the architecture looks like.

{% img center http://i.imgur.com/7rzCmxX.png Architecture of the Python Agent in Raspberry Pi%} 


## Implementation
Now comes the exciting part. I have started work on this at our [RA for IoT Github repo](https://github.com/dulichan/iot-ref-arch/tree/master/python-agent). Currently I have added support to RaspberryPi and BeagleBone Black. Lot of you might ask - why we chose Java instead of Python to write the base agent. This is mainly because of the out of the box support provided by most hardware to run python (RaspberryPi, BeagleBone, Arduino Yun). 

Currently I manage to obtain below data from both platforms -

``` json
{
    'hardware': {
        'node': 'beaglebone',
        'system': 'Linux',
        'machine': 'armv7l',
        'version': '#1SMPFriApr1101: 36: 09UTC2014',
        'release': '3.8.13-bone47',
        'processor': ''
    },
    'platform': {
        'terse': 'Linux-3.8.13-bone47-armv7l-with-glibc2.7',
        'alias': 'Linux-3.8.13-bone47-armv7l-with-debian-7.4',
        'normal': 'Linux-3.8.13-bone47-armv7l-with-debian-7.4'
    },
    'python_info': {
        'version_tuple': ('2',
        '7',
        '3'),
        'version': '2.7.3',
        'build': ('default',
        'Mar14201417: 55: 54'),
        'compiler': 'GCC4.6.3'
    },
    'os': {
        'name': ('Linux',
        'beaglebone',
        '3.8.13-bone47',
        '#1SMPFriApr1101: 36: 09UTC2014',
        'armv7l',
        '')
    }
}
```

## WSO2 Device Manager
After the device enrollment and provisioning -the user can view the device on the Device Manager. All the Device Info is shown as key value pairs on the page. The plan is to show the APIs as operations on the Device Manager. 

{% img center http://i.imgur.com/4qoIeis.png Device Management view of BeagleBone%} 

As for the enrollment part - I thought of writing a separate post on it. There are multiple enrollment mechanisms for IoT devices and the option we see is to support all of them. Right now - the implementation supports token based enrollment. This approach assumes that the agent knows a token that is already registered to a user on the device manager. 



