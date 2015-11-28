---
layout: post
title: Enterprise App Deployment for iOS
date: 2013-07-21 14:13
comments: true
categories: ios
tags:
- jaggery
- enterprise-mobility
---

Enterprise App Deployment in iOS is considered to be hectic and my aim is to lay down the architecture from the Store front of how the App Deployment will function.

First I am assuming the below things -

* 	You have a fully function web sever 
* 	Working knowledge in http request/response passing

Our Enterprise Store is built using [JaggeryJS](http://jaggeryjs.org) (Javascript on the server side). You can develop the Store in any other language you require but the basic architecture will be the same. 

# What is a plist?
Property files or plist files are a genra of property files available in OS X and iOS. They follow the same construct as xml but it's mapped to highlevel concepts like arrays and objects. You'll have to find a property file parser in your language to extract information from the archieve file later required for provisioning information. 

# App Publishing 
In the Application lifecycle, Publishing of the App is the last step towards Live Deployment. We want our Enterprise Apps ready to be deployed via our Enterprise Store. We will fill the Application meta details in to the publishing console and proceed through the review chains and get accepted to the Store. 

We are going to save the .ipa file in storage folder (This can be any implementation of Storage). But refer the file using a special api rather than directly linking the file in our data model. This allows us to intercept the request for the file and return a plist instead. This API end point is mentioned in the below section. 

<!-- more -->

# Store
Store showcases all the Apps available and also connects with the device OS to provision the app to the device. In the Store Front we have an API - 

> /api/ipa/{filename}

This will return a plist file generated to serve Enterprise Deployment. Template of the plist file is as follows (I am following the Handlebars templating system). 

 {% gist 6048047 %}

The plist file instructs where the URL for the archive is available for the OS. 

Below diagram shows the request dispatching from device to server. iOS handles the downloading and installing of the archive in the OS level. We can only provide a plist file to iOS in order to trigger the OS functionality. 

[![image](https://docs.google.com/drawings/d/1pWy9fM65p5irzqbkJBuBRDIAY-X9A3gT5yPjH8xaZmk/pub?w=428&amp;h=231)](https://docs.google.com/drawings/d/1pWy9fM65p5irzqbkJBuBRDIAY-X9A3gT5yPjH8xaZmk/pub?w=428&h=231)

You can test whether this works using the below test page via an iOS device -

``` html Test snippet
<html>
	<header></header>
	<body>
		<a href="itms-services://?action=download-manifest&url=http://ip:9763/publisher/uploads/vHpS0P.plist">Install App</a>
	</body>
</html>
```

# Over-the-Air deployment
To deploy Enterprise Apps over the Air - you have two methods

*	Install an MDM profile and pass a message to install
*	Create a Store App for iOS and instruct the App to trigger the install

If you want to learn addition information regarding Enterprise Deployment refer the [Apple Documentation](http://help.apple.com/iosdeployment-apps/mac/1.1/#app43ad871e).