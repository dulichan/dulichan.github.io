---
layout: post
title: Setup an Apache Proxy for Carbon Servers on Mac OS X
date: 2014-03-15
comments: true
categories: wso2
tags:
- apache 
- httdp 
- proxy 
- reverse-proxy 
- carbon
disqus: y
share: y
---

Setting up an Apache server on reverse proxy is a very basic requirement for deployments. What I am going to explain in this blog post is about setting up a reverse proxy for a WSO2 Carbon web server that is running on port 9763 (for HTTP) . In fact you can skip the carbon specific configurations if you want to set it up for another server. So let's get started.

First you'll have to install apache server on your machine. This alone is one of the most complex steps as it is dependent on your platform (OS X, Windows, Linux). I am going to only show steps for OS X but Proxy Configuration is same for all operative systems. 

## Where is Apache?
You don't have to worry about installing apache cause OS X already has apache server inside of it. It's located under `/etc/apache2` directory (Optionally you can also install [XAMPP](http://www.apachefriends.org/index.html) as well). 

To start the apache server -

``` bash
sudo apachectl start
```

<!-- more -->
## Setup the Proxy Configs
Now the role of the reverse proxy is to send traffic coming out from the network to another host. 

![Reverse Proxy](http://upload.wikimedia.org/wikipedia/commons/6/67/Reverse_proxy_h2g2bob.svg)

We can setup a proxy in apache to do this where `localhost:9763` will go to `localhost:80`. Port `80` is the default http port. For this blog post I will be focusing on setting up proxy over http. I am still looking into https proxy. I'll link that post here once I am done with it. 

There is a config file in apache located in `/etc/apache2/httpd.conf`. You have to include the below section in the bottom of that file.

``` bash /etc/apache2/httpd.conf
<IfModule mod_proxy.c>
#
 # Reverse Proxy
#
ProxyRequests On
<Proxy *>
    Order deny,allow
    Allow from all
</Proxy>
ProxyVia On
ProxyPass / http://localhost:9763/
ProxyPassReverse / http://localhost:9763/
ProxyPreserveHost On
</IfModule>
```

Now restart apache -

``` bash
sudo apachectl restart
```

## Carbon configurations
To configure carbon for reverse proxy you have to change the file -`$SERVER_HOME/repository/conf/tomcat/catalina-server.xml`.  In the configuration file first `Connector` should be changed to below configuration. `proxyPort` attribute was added to the `Connector`.

``` xml catalina-server.xml
<Connector  protocol="org.apache.coyote.http11.Http11NioProtocol"
                port="9763"
                redirectPort="9443" 
                proxyPort="80"
                bindOnInit="false"
                maxHttpHeaderSize="8192"
                acceptorThreadCount="2"
                maxThreads="250"
                minSpareThreads="50"
                disableUploadTimeout="false"
                connectionUploadTimeout="120000"
                maxKeepAliveRequests="200"
                acceptCount="200"
                server="WSO2 Carbon Server"
                compression="on"
                compressionMinSize="2048"
                noCompressionUserAgents="gozilla, traviata"
                compressableMimeType="text/html,text/javascript,application/x-javascript,application/javascript,application/xml,text/css,application/xslt+xml,text/xsl,image/gif,image/jpg,image/jpeg" 
                URIEncoding="UTF-8"/>
```

The apache server will proxy traffic coming through port `80` to port `9763`. 

