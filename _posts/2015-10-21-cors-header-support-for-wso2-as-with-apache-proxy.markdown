---
layout: post
title: CORS header support for WSO2 App Server with Apache Proxy
date: 2015-10-21 14:28:41 +0530
comments: true
disqus: y
share: y
categories: wso2
tags:
- apache
- wso2
---
I will be explaining how to provide support for CORS (Cross Origin Resource Sharing) headers for JAX-RS services hosted on WSO2 Application Server. The support will be provided using Apache which is the proxy. I am going to use a sample deployed in WSO2 App server to demonstrate. 

I have written a previous blog post on setting up [SSL on the Apache server](http://dulitha.me/blog/2014/09/07/load-balancing-proxy-for-wso2-servers/). Please refer that for instructions on setting up SSL. Below is the configuration to setup CORS. Substitute ’10.100.0.167’ for the machine IP/domain. 
<!-- more -->
```
Listen 443
NameVirtualHost *:443
<VirtualHost *:443>
    #ProxyPreserveHost On
    SSLEngine On
    SSLProxyEngine On
    #SSLCipherSuite HIGH:MEDIUM
    SSLProxyVerify none
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]

    
    # Set the path to SSL certificate
    # Usage: SSLCertificateFile /path/to/cert.pem
    SSLCertificateFile /private/etc/apache2/certs/server.crt
    SSLCertificateKeyFile /private/etc/apache2/certs/server.key
    

    ProxyPass / https://10.100.0.167:9444/
    ProxyPassReverse / https://10.100.0.167:9444/
    
    <IfModule mod_headers.c>
           SetEnvIf Origin (.*) AccessControlAllowOrigin=$1
           SetEnvIf Access-Control-Request-Headers (.*) AccessControlAllowHeaders=$1
           Header always add Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
           Header always set Access-Control-Allow-Credentials true
           Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
           Header always set Access-Control-Allow-Headers %{AccessControlAllowHeaders}e env=AccessControlAllowHeaders
    </IfModule>

</VirtualHost>
```
You need to have the below mods enabled in order for the above configuration to work.

```
LoadModule proxy_module libexec/apache2/mod_proxy.so
LoadModule proxy_connect_module libexec/apache2/mod_proxy_connect.so
LoadModule proxy_ftp_module libexec/apache2/mod_proxy_ftp.so
LoadModule proxy_http_module libexec/apache2/mod_proxy_http.so
LoadModule proxy_scgi_module libexec/apache2/mod_proxy_scgi.so
LoadModule proxy_ajp_module libexec/apache2/mod_proxy_ajp.so
LoadModule proxy_balancer_module libexec/apache2/mod_proxy_balancer.so
LoadModule ssl_module libexec/apache2/mod_ssl.so
LoadModule setenvif_module libexec/apache2/mod_setenvif.so
LoadModule headers_module libexec/apache2/mod_headers.so
```

What happens in the above config is that it will automatically generate the response for the preflight request (OPTIONS). This is done by the below config snippet

```
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
```

There are several headers that need to be setup for to enable CORS. They are setup using the headers module.

```
<IfModule mod_headers.c>
           SetEnvIf Origin (.*) AccessControlAllowOrigin=$1
           SetEnvIf Access-Control-Request-Headers (.*) AccessControlAllowHeaders=$1
           Header always add Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
           Header always set Access-Control-Allow-Credentials true
           Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
           Header always set Access-Control-Allow-Headers %{AccessControlAllowHeaders}e env=AccessControlAllowHeaders
    </IfModule>
```

An interesting thing I am doing here is - using the Origin header to write back the `Access-Control-Allow-Origin`. It is generally recommended to only allow required methods and explicit headers. 

To test the above setup I am going to use the sample JAX-RS artifact that is deployed to test this. Run the below JavaScript in the console of a different website. 

``` javascript
$.ajax({ 
  url: 'https://10.100.0.151/jaxrs_basic/services/customers/customerservice/customers',
  type: 'PUT', 
  headers: {"Content-Type": "application/json"},
  data: {},
  success: function(data) {
    alert('Load was performed.');
  }
});

``` 

If run the above code snippet, commenting the headers in the apache config file - we’ll be getting the below errors from the browser.
{% img http://i.imgur.com/7JsUqwB.png %}

If successfully - you’ll get a 400 response (since the payload is incorrect) but the request passed through to the WSO2 App server.

{% img http://i.imgur.com/vQ8HqkG.png %}
