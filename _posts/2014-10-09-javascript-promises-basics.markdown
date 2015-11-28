---
layout: post
title: JavaScript promises- basics
date: 2014-10-09 06:08:13 +0530
comments: true
categories: javascript
tags:
- nodejs
- promises
- callbacks
disqus: y
share: y
---
Before we get anywhere on promises, paying some tribute to callbacks is necessary evil. Below code uses a native node module (`fs`) to read a file and write the content of that file to another destination. 

``` javascript
fs.readFile("bb", function(err, data) {
    if (err) return next(err);
    fs.writeFile("bba", data, function() {
        console.log("File written");
    });
});
```

If we think node as a human - we are saying to node, “Hey dude, copy file to destination and once you’re done, execute this function too”.  Callbacks are needed to execute logic after some other logic has been executed. This is the holly grail of asynchronous programming. 
 
{% img center http://i.imgur.com/H5D9EWs.png Callback joke %}
<!-- more -->
## Now promises
Callbacks are all nice before you get into a [callback hell](http://callbackhell.com/). There is a an example gist that shows exactly what a callback hell is! I know it’s subjective to state callbacks are evil. But if there is something better out there (such as promises) why not use the new technique.

{% gist 8459026 gistfile1.js %}

## Promises -simple explanation
What is a promise? It’s an object that can be used to obtain the result of an async calls. Let’s see how this actually looks in code -

``` javascript
fs.readFileAsync("bb").then(function(data) {
    return fs.writeFileAsync("bba", data);
}).then(function(){
	return "bba";
}).then(function(name){
	console.log("File "+name+" written");
})
.catch(function(e){
    console.error("unable to read file")
});
```

It does look a little bit better right? Now we are chaining all the async function together with promises. When ever we return something from a promise -that return will be passed to the next promise as input. But there is a catch - If another promise is returned inside a promise - the promise chain includes the new promise to the chain. As you can see `fs.writeFileAsync` returns  a promise. But only after that promise is executed - our next promise runs.

In case you were wondering from where <code>fs.readFileAsync</code> and <code> fs.writeFileAsync</code> - there is a nice library called <code><a href=“https://github.com/petkaantonov/bluebird”>bluebird</a></code> that can be used to promisify a promise unaware module. 

## The power of Promise passing
You might say that Promises are just syntactical sugar from the above example but it has way more power than that. Best part about a promise is that it’s an object. What is an object can be passed easily across modules. 

``` javascript
var promise = fs.readFileAsync("bb").then(function(data) {
    return fs.writeFileAsync("bba", data);
}).then(function() {
    return "bba";
}).
catch (function(e) {
    console.error("unable to read file")
});
// in another layer
promise.then(function(name) {
    console.log("File " + name + " written");
});
```

## Promise spec and implementations
Promises are not yet available natively in JavaScript. ECMA6 will change that soon but until then there are many libraries that support Promises. I personally use `bluebird` but there are many others. Many libraries also follow the [Promise/A+](https://promisesaplus.com/) specification which provides interoperability for your code. There is also something new around the block called [generators](http://jlongster.com/2012/10/05/javascript-yield.html). 

I have made all the examples I brought up available as a [gist](https://gist.github.com/dulichan/3ce43ee115359e99663b).  Play around with the code to get a hang of it. I started actually using Promises because of [Thinky](http://thinky.io) - an ORM client for RethinkDB. It’s an awesome ORM for RethinkDB, please check it out if you are using RethinkDB with Node. 