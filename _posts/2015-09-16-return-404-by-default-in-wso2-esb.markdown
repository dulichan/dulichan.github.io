---
layout: post
title: Return 404 by default in WSO2 ESB
date: 2015-09-16 21:16:25 +1000
comments: true
categories: wso2
disqus: y
share: y
tags:
- wso2-esb
- wso2-api-manager
---

WSO2 ESB by default responds to requests with 202 HTTP status code behavior. This behavior can be specially nuisance when exposing APIs or Proxy services from the ESB. In this post I am explaining two changes to be done to change this behavior where a 404 HTTP status code is returned. 

## Main sequence change
In the ESB - there are 2 main sequences called main sequence and fault sequence. ESB invokes the main sequence if no matching API or Proxy service is found. If an error occurs inside a sequence and no fault sequence has been defined, the fault sequence is called. The 2 sequences are present in the <ESB_HOME>/repository/deployment/server/synapse-configs/default/sequences. 

We are going to change the main sequence to return 404. 

{% gist 90b8cfe840eb2248b267 main.xml %}

## 404 from APIs
APIs are special implementations in synapse that has couple of resources attached to it. API implementation  of Synapse looks for a very specific sequence with the name - `_resource_mismatch_handler_` to call when no resource inside the API is invoked from the request. Otherwise it returns 202 HTTP response. Due to this - we have to create the below sequence and deploy.

{% gist 90b8cfe840eb2248b267 _resource_mismatch_handler_.xml %}

The historical reason of returning 202 lies back where the main sequence was shipped as a sample not as the default behavior of the WSO2 ESB product. It should be customized to suite the needs required. The same applies to _resource_mismatch_handler_ sequence. 