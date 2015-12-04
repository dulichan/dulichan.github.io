Solving relationship problems with Graph technology

Before I get started - I am not ranting about a new dating algorithm I wrote. This post is going to be about Graph databases and kickstarting work with python. Before I talk about graph databases, I’ll briefly explain how I found myself hacking with Neo4j graph database 2 am in the morning. 

I wanted to build a tool for finding opportunities. For example - I have an idea for a connected shoes. I would like to find a co-founder to work with on this project. Reaching out to my network to find a suitable candidate is troublesome. In the manual process - I have to either open a Facebook chat or shoot an email to get my intentions across. 

How useful would it be for me to go to a user interface and type - “interests:- iot,startups,entrepreneurship, skills:-javascript, electronics, age: 20>29 

[create a graphic with the above query]

## Graph Databases

Enter graph databases. They are meant to purely manage relationships and properties of actors. It’s a different data model compared to our traditional Relation Databases. Let’s try my problem mapped to the Graph data model.

As you can see - Naveen is a node and under it has properties. The part missing is relationships to other nodes.

Now we know that Naveen works at a software company specialized in JavaScript. 

If a tool could suggest few people like this based on a loose criteria, it would definitely help my search. 

## Getting dirty with Neo4J & Python

Since the above example is advance, I am going to start work by a simple query. Find me all the people who have skills of “JavaScript” and interests on “IoT”.

I picked the most popular graph database: [Neo4j](http://neo4j.com/download/) for a spin. It’s made with Java and Scala and fairly easily to get started. You can give a database directory and it loads up a graph database server. 

You can access the browser console through `http://localhost:7474/browser/`. First I am going to run some queries and enter data into Neo4j. 

```
CREATE (arshad:Person { name: 'Arshad Mohideen', age: 24, interests:["startup", "entrepreneurship", "toastmaster"], skills: ["public-speaking", "people-management"]})

CREATE (naveen:Person { name: 'Naveen Dilan', age: 23, interests:["startup", "entrepreneurship", "iot"], skills: ["javascript", "event-organizing"]})

CREATE (yuda:Person { name: 'Yudhanjaya Wijeratne', age: 24, interests:["startup", "entrepreneurship", "journalism", "media"], skills: ["writing", "public-speaking"]})
```

In case you are wondering - this query language is called [Cypher](http://neo4j.com/developer/cypher-query-language/). It’s like a SQL and JSON combination. `:Person` is called a label in the graph world. Labels are used to categorize nodes. Properties are defined inside the JSON property bag. In the Graph world below are the main concepts:-

1) Nodes
2) Relationships
3) Properties
4) Traversal 

[Neo4j Docs](http://neo4j.com/docs/stable/graphdb-neo4j.html) give a good understanding of these key concepts. 

Next I am using flask to create a quick web api. This web api return “Hello World” for now. The recommended method to access Neo4j from Python is through [py2neo](http://py2neo.org/2.0/). 

``` python
from flask import Flask, request
#we are importing the below entities from py2neo
from py2neo import Graph, Node, Relationship, authenticate
import collections
import json

app = Flask(__name__)

@app.route("/query")
def query():
	return “Hello World”

if __name__ == "__main__":
	app.debug = True
	app.run()
```
How do you work with Neo4j? You need to obtain a Graph object. Before getting the graph object, I need to authenticate with the password.  
``` python
authenticate("localhost:7474", "neo4j", "abc123")
graph = Graph()
```

After authenticating - a Cypher query needs to be crafted to match for for the problem I had earlier. 

```
MATCH (p:Person) 
WHERE ANY(interests IN p.interests WHERE interests =~ '(?i).*iot.*') 
	  AND ANY(skills IN p.skills WHERE skills =~ '(?i).*javascript.*') 
RETURN p
```

The above query can be translated to: “Find all persons with interests of ‘iot’ and skills of ‘javascript’”. Now I can use this query in python to extract the data. 

``` python
statement = "MATCH (p:Person) WHERE ANY(interests IN p.interests WHERE interests =~ '(?i).* iot.*') AND ANY(skills IN p.skills WHERE skills =~ '(?i).* javascript.*') RETURN p"
person_list = []
for person in graph.cypher.stream(statement):
	person_list.append(person[0].properties)
#convert the person_list to a JSON array
return json.dumps(person_list)
```  
When I do a curl to the endpoint - I get a JSON response of only naveen’s node. 

# Footnotes
Graph technology can be used to solve some problems that we have solved with relational databases with workaround and hacks. There are many business use-cases where relationships in between objects can be used to gain leverage. A valid business use-case would be: Giving a coupon for baby toys for a shopper who bought some baby napkins. To calculate this using a traditional database - it would take lot of processing power. [Graph database](https://dzone.com/articles/mysql-vs-neo4j-large-scale) hits the sweet spot on these types of problems. Now let me hook this up with LinkedIn API and I’ll have an ultimate stalker tool in my hands.  

http://neo4j.com/books/graph-databases/

