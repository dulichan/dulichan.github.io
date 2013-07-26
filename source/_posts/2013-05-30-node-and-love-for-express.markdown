---
layout: post
title: "Node and love for Express"
date: 2013-05-30 23:08
comments: true
categories: [nodejs, express.js, mvc, architecture]
---

Node.js is kind of like the thing in the block. Everyone is talking about it and everyone is very excited about the idea of having javascript in the server-side. Earlier days - javascript was something web developers hated. Because it was cryptic and had certain paradigms for programming compared to java made people very anxious. But javascript kinda of started rolling with animations and cool visual expressions. Javascript became the tool to engineer user experience to web apps. That is the story of javascript. 


I started working on my SleepCycler app again. It was near completion but I wanted to have an analytics interface for web for me to go and figure out the sleep cycles I have enjoyed for the past week and month and how was the experience. For that I needed a webapp. 

I always wanted to try out node.js and I have done some stuff with sample apps and it seems to be ideal for the current technical requirement. 

<!-- more -->

### Basics

The node app will connect to a mongo datastore that will extract information I have stored via a crawler app. The data will be displayed for the web user in an analytics approach. It's a very simple usecase. Take data out of mongo-> Render it on HTML and fancy graphics. 

### How I complicated it

I might be the grand-daddy of simplification but I wanted to learn as much as possible. So below are some of the stuff I am using -

	*	Express middleware
	*	Hogan.js templating
	*	Mongoose for mongo
	
I had to do a bit of work to get Hogan.js to work since I had to update the project from Express 2.5 to 3.X. Then only was the latest Hogan.js npm module was working. 

### Agent app

The crawler that searches twitter is written in python. We can configure it work as a process as well as a agent (running in background polling twitter periodically). Agent app will pick up tweets per user and persist them to mongodb. 

### Time 

Now the real challenge in this problem is figuring out at what time the user went to bed and at what time he got up. We are going to use the tweets the user posts to understand that. The initial idea was to figure it out using the time lapse of tweets from a user. But that is a poor mechanism where we find users not tweeting for days. So the other one was to capture user's 'Good morning' and 'Good night' messages. That way we can accurately now it. But for this to work out, the user has to tweet every morning and night. 

### Algorithm

We will sort the stats found for user for the date.
