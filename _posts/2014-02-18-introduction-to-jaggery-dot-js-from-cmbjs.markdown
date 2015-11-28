---
layout: post
title: Introduction to Jaggery.js from CmbJS
date: 2014-02-18 14:49:40
comments: true
categories: javascript
tags:
- cmbjs 
- jaggery
disqus: y
share: y
---

We had the 3rd [JavaScript meetup](http://www.meetup.com/Colombo-JS-Meetup/events/163220432/) on February 13th until I ruinedined everyone's life by coding in my talk :). Now it's time to spread some light to people who didn't understood my talk.

## Slides
First is the [slide deck](https://speakerdeck.com/dulichan/introduction-to-jaggery-dot-js). It doesn't have much slides but gives a list of features of jaggery.

## Hands-on jaggery.js
Next is the interesting bit where we develop a todo-list app from scratch. I am using Angular for this project since I am tried of binding stuff to my UIs. 

First clone the [Github project](https://github.com/dulichan/jaggery-handson) for the hands-on exercise. I took [Grunt] and [Yeoman] as the tools to scaffold the app. 

Next download the Jaggery server from the [jaggerjs site](http://jaggeryjs.org/) and extract the server. In the server there is a folder called apps. This folder has all the apps that will be deployed when the server starts up. To start up the server run `sh bin/server.sh`. I have [soft linked] the cloned repo's app folder to the apps folder of the jaggery server.
<!-- more -->
## Basic html & javascript
When you browse to `https://localhost:9763/apps/app` it will show a scaffolded page. Next we are going to remove that content and place a list with some angular directives. 

{% gist 9cf0136024aefcddded9 main1.html %}

When we have the todos object in the [angular scope](http://docs.angularjs.org/guide/scope), it will be looped and added as `<li>` elements to the list. Now we need to code up the javascript to put the todos to the scope.

``` javascript app/scripts/controllers/main.js
'use strict';
angular.module('3rdMeetupApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.todos = [
      {text:"First task", status:0},{text:"Second Task", status:1},{text:"Third Task", status:0}
    ];
  });
```

Next objective is to get the todo items from the server side. Before go further we have to know little bit about the jaggery.conf file.

## jaggery.conf to the rescue
If you are coming from the Java EE background you would know about the [web.xml](http://en.wikipedia.org/wiki/Deployment_descriptor) file. Jaggery's configuration file for the app is called [jaggery.conf](http://jaggeryjs.org/apidocs/jagconf.jag) - it is used for 

- URL mappings
- specifying log level
- basic authentication
- error pages

We are going to add a `jaggery.conf` file for our app as well.

``` json jaggery.conf
{
    "displayName":"JSMeetup",
    "logLevel" : "debug",
    "urlMappings" : [
    {
      "url" : "/api/*",
      "path" : "/router.jag"
    }
  ]
}
```

What this will basically do is - map all the requests that arrive to `api/*` URL pattern to the `router.jag` file. 

## .jag files
After mentioned the `.jag` files you might be confused as to what's this new extension. `.jag` is the extension used for jaggery.js server pages. Below is our `router.jag` file.

``` javascript router.jag
<%
var goose = require("/modules/goose.js").goose;
var router = new goose({
    CONTEXT: "/jsmeetup/api/"
});
var log = new Log();
router.get("todos", function(ctx) {
  var todos = [
      {text:"First task", status:0},{text:"Second Task", status:1},{text:"Third Task", status:0}
    ];
    print(todos);
});
router.process(request); %>
```

We have used a module called [goose.js](https://github.com/dulichan/goose.js) that is used for jaggery routing and added a route for `todos` endpoint. We'll also change our client side accordingly.

``` javascript app/scripts/controllers/main.js
'use strict';
angular.module('3rdMeetupApp')
  .controller('MainCtrl', function ($scope, $http) {
    var BS = function(){
      alert("Better call Saul!!!");
    }
    $scope.todos = $http.get("api/todos").success(function(data){
      $scope.todos = data;
    }).error(BS);
  });
```

## Querying the Database
Jaggery.js has a neat feature to get database tables as json objects. First we have to download the driver of the database, in my case [MySQL driver](http://dev.mysql.com/downloads/connector/j/) and place the driver in the `JAGGERY_HOME/carbon/repository/components/lib` folder.

I am also going to create a table called `todos` in a database. Below is the SQL for the table -

``` sql
CREATE TABLE `todos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(200) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
```

Next I am changing the `router.jag` to query the database.

``` javascript router.jag
<%
var goose = require("/modules/goose.js").goose;
var router = new goose({
    CONTEXT: "/jsmeetup/api/"
});
var log = new Log();
var database = new Database("jdbc:mysql://localhost:3306/test", "root", "");
router.get("todos", function(ctx) {
  var todos = database.query("SELECT * FROM todos");
    print(todos);
});
router.process(request); %>
```

If you view the page now - you'll see that the rows in the table got rendered to the list. 

## Adding a new todo
Next we are going to add a new todo to the table. First we are going to create the form and the client side javascript required.

{% gist 9cf0136024aefcddded9 main2.html %}

We added the `ng-submit` directive to evoke a javascript method when the form is submitted.

``` javascript app/scripts/controllers/main.js
'use strict';
angular.module('3rdMeetupApp')
  .controller('MainCtrl', function ($scope, $http) {
    var BS = function(){
      alert("Better call Saul!!!");
    }
    var list_todos = function(){
      $http.get("api/todos").success(function(data){
        $scope.todos = data;
      }).error(BS);
    }
    $scope.addTodo = function(){
      $http.post("api/todos", {text:$scope.todoText}).success(function(){
        list_todos();
      }).error(BS);
    }
    list_todos();
  });
```

In our controller we also extracted the logic to get new todos to a method called `list_todos()`. Calling this method when the script runs will add the todos to the current scope. Also when a new todo is added it will rerun the method to get the new todos from the server and adding it to the current scope. 

Now we are going to prepare the server side for the adding of a todo item.

``` javascript router.jag
<%
var goose = require("/modules/goose.js").goose;
var router = new goose({
    CONTEXT: "/jsmeetup/api/"
});
var log = new Log();
var database = new Database("jdbc:mysql://localhost:3306/test", "root", "");
router.get("todos", function(ctx) {
  var todos = database.query("SELECT * FROM todos");
    print(todos);
});
router.post("todos", function(ctx){
  database.query("INSERT INTO `todos` (`text`, `status`) VALUES (?, 0);", ctx.text);
});
router.process(request); %>
```

## Ticking a todo
Now what's left is crossing off a todo when it's done. For this we are going to modify the html of the view first.
{% gist 9cf0136024aefcddded9 main3.html %}

Only change we did was add a `ng-click` event to the checkbox. This will trigger the associated javascript event with the current todo as a parameter. In the client side we are going to capture this and send it to the server.

``` javascript app/scripts/controllers/main.js
'use strict';
angular.module('3rdMeetupApp')
  .controller('MainCtrl', function ($scope, $http) {
    var BS = function(){
      alert("Better call Saul!!!");
    }
    var list_todos = function(){
      $http.get("api/todos").success(function(data){
        $scope.todos = data;
      }).error(BS);
    }
    $scope.addTodo = function(){
      $http.post("api/todos", {text:$scope.todoText}).success(function(){
        list_todos();
      }).error(BS);
    }
    $scope.check = function(todo){
      $http.put("api/todos", {id:todo.id, status:todo.status}).success(function(){
        list_todos();
      }).error(BS);
    }
    list_todos();
  });
```

Next tweak the `router.jag` to handle the new `put` API call.

``` javascript router.jag
<%
var goose = require("/modules/goose.js").goose;
var router = new goose({
    CONTEXT: "/jsmeetup/api/"
});
var log = new Log();
var database = new Database("jdbc:mysql://localhost:3306/test", "root", "");
router.get("todos", function(ctx) {
  var todos = database.query("SELECT * FROM todos");
    print(todos);
});
router.post("todos", function(ctx){
  database.query("INSERT INTO `todos` (`text`, `status`) VALUES (?, 0);", ctx.text);
});
router.put("todos", function(ctx){
  var status = ctx.status?0:1;
  database.query("UPDATE `todos` SET `status`=? WHERE `id`=?", status, ctx.id);
});
router.process(request); %>
```

Voila - a completed todo list. As you saw above Jaggery.js provides support to build server-side javascript apps quickly and efficiently. Maybe the example might look a little bit complex for people who are new to [Angular](http://angularjs.org/) but even so you can understand how easy it was to build a backend API. 
