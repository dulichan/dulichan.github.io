---
layout: post
title: "Playing Binary Dice with Arduino"
date: 2013-05-18 12:23
comments: true
categories: arduino
tags:
- Eletronics
- Hobbyist
- iot
---

I wanted to play with Arduino for a long time and now I got a weekend that I can work on it. Unfortunately I need to boot a new OS to my RaspberryPi to work since I had some issues connecting the Network interface to it. Anyway I am trying to build a small LED Dice as a starter project for Arduino. I got myself a book regarding Arduino which had this toy project.

# The Circuit 

I knew that Arduino's 13th socket can be used to connect LEDs directly to the board but didn't knew actually why. Arduino sockets have high voltage but the 13th socket has a inbuilt 1k resistor inbuilt. For this project I am using 12, 11, 10 sockets. 

{% img /images/IMG_0589.JPG %}

<!-- more -->

## Breadboard basics

One of the biggest hiccups I faced was not knowing how to use the breadboard properly. Well everything has a learning curve. You can't traverse opposing currents in the same line of the breadboard. It will not work that way. Below is an example. 

{% img /images/IMG_0590.JPG %}

The top most resistor and LED are connected in the wrong way. The other two are connected in the correct way.

{% quote %}
So be careful when using the breadboard. Also another {"good tip is to cut off the pins to the right size"} since it becomes a head-ache to manage them.
{% endquote %}

# Conclusion

I am starting my work on Arduino and will be learning more and more about electronics in the following months. I have couple of projects planned out. Also there is a Sri Lankan Arduino alternative built which is called TechArduino which is a cheaper alternative so the motivation to build more projects is arising :D. 
 