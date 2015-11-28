---
layout: post
title: Load Balancing Proxy for WSO2 Servers
date: 2014-09-06 20:24:18 -0700
comments: true
categories: wso2
tags:
- load-balancing
- proxy-servers
- apache
disqus: y
share: y
---
I have written a post previously about setting up [Apache Proxy for Carbon Servers on Mac OS X](http://dulitha.me/blog/2014/03/15/setup-an-apache-proxy-for-carbon-servers-on-mac-osx/). This time - I will be focusing on the SSL aspect and load balancing aspect of it. For this particular use case I am going to take the WSO2 Identity Server. The final scenario is to have a deployment architecture where 2 WSO2 Identity Servers load balances the traffic coming to the Proxy. 

{% img center http://i.imgur.com/cfmvG2I.png Simple load balancing use case %}

<!-- more -->
## Finding httpd.conf 
This depends vastly on the OS. For Mac OS X - this is located usually `/etc/apache2/httpd.conf`. Red Hat Linux  put this file in `/etc/http.d/`. 

## Necessary modules
Apache server is broken into the core and modules. Some modules are not enabled by default in certain distributions. Modules are defined in the httpd.conf file. This file is read by apache server in startup to configure itself. Below are the necessary modules for Apache 2. Check if below modules are available in the httpd.conf. If not you’ll have to install them using your package manager-

```
LoadModule proxy_module libexec/apache2/mod_proxy.so
LoadModule proxy_connect_module libexec/apache2/mod_proxy_connect.so
LoadModule proxy_ftp_module libexec/apache2/mod_proxy_ftp.so
LoadModule proxy_http_module libexec/apache2/mod_proxy_http.so
LoadModule proxy_scgi_module libexec/apache2/mod_proxy_scgi.so
LoadModule proxy_ajp_module libexec/apache2/mod_proxy_ajp.so
LoadModule proxy_balancer_module libexec/apache2/mod_proxy_balancer.so
LoadModule ssl_module libexec/apache2/mod_ssl.so
```

## Certificates for SSL 
A certificate generation is necessary to perform SSL Proxy. We generate a private key using Open SSL. When generating the private key - use wso2carbon as the pass phrase. 

`openssl genrsa -des3 -out server.key 1024`

Afterwards - we generate the Certificate signing request (.csr). 

`openssl req -new -key server.key -out server.csr`

By using both the CSR request and the private key - we can generate a certificate for particular number of days.  

`openssl x509 -in server.csr -out server.crt -req -signkey server.key -days 365`

Copy your certificate file (server.crt) and private key (server.key) to a directory inside apache. Let’s put it to a folder called certs under apache. 

EDIT:- 
In the new Apache version (Apache/2.4.16) below additional configs are needed to enable SSL inside the VirtualHost.
```
    SSLProxyVerify none
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
```

## Configure Apache for certificates
Let’s get down and dirty with the https.conf file now. Forget about all the default configurations in the file and scroll to the bottom of the file. First we are going to add the balancer. We are adding the two server hostnames as balancer members. 

```
<Proxy balancer://mycluster>
    Order Deny,Allow
    Deny from none
    Allow from all
    ProxySet lbmethod=byrequests

    # Define back-end servers:
    # Server 1
    BalancerMember https://localhost:9443/
    BalancerMember https://localhost:9453/
</Proxy>
```

Next we are going to configure a VirtualHost that uses the above balancer. First - apache will have to listen to `443` port. `443 `is the default SSL port. The private key and the certificate is configured inside the virtual host. Also note that after the cluster name (mycluster) the ‘/‘ is necessary. 

```
Listen 443
NameVirtualHost *:443
<VirtualHost *:443>
    SSLEngine On
    SSLProxyEngine On
   
    # Set the path to SSL certificate
    SSLCertificateFile /private/etc/apache2/certs/server.crt
    SSLCertificateKeyFile /private/etc/apache2/certs/server.key
   
    # Setup the balancer:
    ProxyPass / balancer://mycluster/
    ProxyPassReverse / balancer://mycluster/
       
</VirtualHost>
```

## Configure the certificate password
Create a file in the certs folder as pass. Include below content to that file -

```
#!/bin/sh
echo "wso2carbon"
```

In the httpd.conf file - outside the Virtual Host, put below configuration to setup the password. This will read the password from that file. Otherwise we have to provide the pass phrase of the private key every time we start the server. 

```
SSLPassPhraseDialog  exec:/private/etc/apache2/certs/pass
```

Now if you access https://localhost - you’ll be proxyed to either Identity servers running in `9443`, `9453` ports. 

## Real world use case
There are several use cases for using a proxy. First - a proxy can be used to securely proxy traffic to the identity server sitting in the internal network. This way the proxy is in the DMZ. Another use case is to provide high availability (HA). The Proxy can be used to direct traffic to couple of servers where if a server goes down - other servers will continue to process requests. 

{% img center http://i.imgur.com/mQxyBjl.png Real Deployment use case %}
