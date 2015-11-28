---
layout: post
title: Some thoughts on Caramel.js
date: 2013-06-23 22:32
comments: true
categories: javascript
tags:
- jaggery
- frameworks
---
We have been using [jaggery](http://jaggeryjs.org) for most our internal work at WSO2 and I am integrating the [Caramel MVC framework](https://github.com/wso2/caramel) for the WSO2Store and WSO2Publisher that will be coming out in the Enterprise Store.

The Generic store is already built using Caramel so the only way to integrate our apps with the generic store is to go the Caramel way.

I tried using Caramel and got bit confused as it was not directly adhearing to the MVC pattern that I was familiar with. 

## Absolute.js
Due to all of the confusions and regarding Caramel and it's complexity of building apps faster we thought of implementing a rather simple idea. I have already written about [absolute.js](https://github.com/dulichan/absolute.js) in [my blog before](http://dulichan.github.io/chan/blog/2013/06/05/simple-mvc-for-jaggeryjs/) as well. 
<!-- more -->
After the review meeting we came to a conclusion to improve Caramel by decomposing it into pieces and implement different patterns.

## Pros of Caramel
After going through the [blog samples](http://wso2.github.io/caramel/) and understanding how Caramel works I found great features we can include to absolute.js without derailing from it's initial goal - 'MVC on steroids'

* Asset pipeline
* Theme support
* Unified directory structure
* Controller is theme based
* Abstraction of Template engine

## Middleman 
Caramel framework introduces a middleman in between Controller and View called Renderer. The renderer is the component that is actually theme based. This looks like a good approach but it would be better if the renderers of pluggable nature where the renderer will only be executed if it exists. 

## Changes to Absolute.js
There are some changes we need to do for absolute.js as well. We will have to take out the controller-view matching approach and enable a pluggable nature to it.

## Improving Caramel
Hard part of improving caramel is that it's already used in many projects. Changes to how it works may actually affect everything built based on it. So we will have to be careful in the improvements. If all comes to worse. We can keep the current verson of caramel for the products and build Caramel 3 with the improved concepts and features and later on migrate Caramel version in other products.
