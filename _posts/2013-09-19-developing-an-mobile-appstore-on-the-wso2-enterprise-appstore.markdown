---
layout: post
title: Developing an Mobile AppStore on the WSO2 Enterprise AppStore
date: 2013-09-19 19:03
comments: true
categories: wso2
disqus: y
share: y
---
At WSO2Mobile - when we wanted to develop the Enterprise Mobile AppStore we had a company wide philosophy(including WSO2). It was about an Enterprise AppStore different types of assets - Mobile Apps, Dashboards, APIs. We call it - 'Unified Enterprise Store'. 

I am going to share my experience developing the Enterprise Mobile AppStore (utilizing the WSO2Store container). You may wonder what this container jargon is. The Store has two sections -
<!-- more -->
* Store container or shell 
* Store asset implementation 

## Store container or shell 
The container provides the modules and basic infrastructure necessary to develop the store. It's developed using JaggeryJS (A server side javascript implementation) and a theming framework - Caramel.js. 
In a nutshell - a Store builder can build an asset implementation (a folder containing all the implementation details regarding the asset and the RXT document).  

## Store asset implementation
Asset implementation is what the Store builder develop. It can hold all the details regarding the asset's specific implementations. For an example - while developing the WSO2MobileStore we added the device level capabilities into the store such as 
* OTA - Over the Air Deployment of Apps
* Apps installed on the Device

## Main problems we faced
Since we were building on a product that was still evolving we had to change our implementation details from time to time. Also another important problem we faced was merging the changes from the main branch since we were not working on a released version. 

You can find the WSO2Enterprise Store github repository[here](https://github.com/wso2/enterprise-store) and the MobileStore repository [here](https://github.com/WSO2Mobile/mobilestore). 