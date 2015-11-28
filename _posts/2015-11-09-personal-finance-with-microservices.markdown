---
layout: post
title: Personal Finance with Microservices
date: 2015-11-09 10:20:51
comments: true
category: microservices
disqus: y
share: y
tags: 
- finance
- microservices
- node
---
Personal finance is an interesting topic. Everyone has their own ideal ways of managing personal finances. Being too lazy to enter CSV file to a Numbers sheet, I went ahead and wrote a micro service to hook up expenses into a Google sheet. 

First off, there are applications to manage personal finances that are based on popular methods. For example,  My friend [Yuda](https://medium.com/@yudhanjaya) uses an app called [Wave](https://www.waveapps.com/) to manage personal finances. 

I am not a big fan of these application due to below reasons -

* Not accessible enough 
* Budgets - Arrrrr, I hate budgets.
* Unnecessary analytics (how much money spent against earned! I don’t want to know how broke I am with a chart)
* Currency conversion (since I end up traveling, I need multiple currency support)
* Crappy UI (biggest turn off)

*I know that I am ranting a bit but it’s personal finance*
<!-- more -->
Then I met [Daily Costs](http://dailycost.com/), an iPhone app that can be used to note costs easily. Beer , 320, Coffee 250 got it. It was all easier to collect the expenses now. Better yet, I could export all that data into a CSV file. 

What I was missing now was some analytics on this data. I earlier had a Numbers (an Excel like program for Mac) sheet that did a decent job. Numbers was limited to the local machine and I had to manually enter the data from the CSV to the sheet. This was often messy and I forget to do this all the time. 

Since I was looking into Micro services, I thought of building a small service to act on this event and write the CSV generated to a Google Sheet. Sounds simple. I looked back into my usually process of how I would normally handle this scenario. 

{% img center https://docs.google.com/drawings/d/1L5XYnERMBk3lPYhJNinME8Ul-mKNINVaEf7SzxnTT80/pub?w=554&h=282 Diagram of the process flow of usual personal finance session %} 


Sending an email out every weekend from the app was easy. Only require a simple reminder. Catching this email received event was the important part. Then I remembered that there is a cool service called IFFT that can be used for this connection. 

By using IFFT Gmail recipe, I listened to a new email event to my google account with a particular subject. The trigger for this was to call a web endpoint. Now what I need was something to write my service on. Something ideally easy to use, free (or low cost), and no management. There is a micro service platform called [Hook.io](http://bit.ly/20w3FF7). Hook.io allows me to run a piece of JavaScript code in the cloud with a simple web trigger. Just like the trigger provided by IFFT. 

A nice feature of Hook.io was that it allowed me to use all the modules (plugins) and other tools of Node (the JavaScript web runtime). 

I had the sketch of the code in my mind  - first I needed to get the CSV file. IFFT can make the request to the web endpoint with a file url of the attachment. Then I downloaded the CSV file from this link. 

{% img center https://docs.google.com/drawings/d/1LfOX-8qBHotHXFCYYaiIYBFSQgGvQZLhlgRUdWD-fzo/pub?w=551&h=275 Show the IFFT trigger out picture %} 


Next was to convert the CSV to an array structure using the csv-parse module. This would allow me to write the whole CSV to a history transaction sheet on the Google Sheet. Next - I iterated and found the transactions for the current month and inserted them to a separate sheet. 

With the help of the nifty little module (google-sheet-npm), I can read the Google Sheet and write. The only problem I had was authenticating into the Google Sheet. I didn’t want to use oAuth, the default mechanism provided to authenticate and authorize 3rd party resources in the web. 

Google has an alternative called machine authentication. Google gives you a file based (JSON) token that can be used for authenticating which is associated with a newly generated google account. You need to authorize the google sheet for that google account.  

{% img center http://i.imgur.com/A8xLYjU.png %} 


And behold the code:-
```lang:javascript title:"finance.js" class:"code-block-tinker" url:"https://gist.github.com/dulichan/64e672354a7136a1df4b" link-text:"gist"
module['exports'] = function echoHttp (hook) {
	var body = hook.params; // This gives all the JSON body parameters in an object.
	
	//Using a small security measure ;)
	if(body.secret != "dgfdg45345jf0248234234"){
		hook.res.end("Unauthorized");
		return;
	}

	var https = require('https'),
	parse = require('csv-parse'),
        fs = require('fs'),
        GoogleSpreadsheet = require("google-spreadsheet");

	var TRANSACTION_SHEET_ID = "6665";
	var HISTORY_SHEET_ID = "dfgdfg7"; 
	 
	// spreadsheet key is the long id in the sheets URL 
	var my_sheet = new GoogleSpreadsheet('uwoiruweoiruwoierwer-og');
	
	// The JSON credential token obtained from Google - https://developers.google.com/drive/web/auth/web-server
	var creds = {
	};
	/*
		Download the file from location and invoke the call back
	*/
	var getFile = function(location , callback){
		https.get(location, function(response) {
		    // Continuously update stream with data
	        var body = '';
	        response.on('data', function(d) {
	            body += d;
	        });
	        response.on('end', function() {
	            callback(body);
	        });
		});
	};

    	try{
    		getFile(body.attachmentURL, function(data){
    			// Parsing the downloaded data into CSV
	    		parse(data, {comment: '#'}, function(err, output){
	    			// Output is an array
	    			my_sheet.useServiceAccountAuth(creds, function(err){
	    			  // Use this to find the id of the sheet
	    				my_sheet.getInfo( function( err, sheet_info ){
					        console.log( sheet_info.title + ' is loaded' );
					        var sheet1 = sheet_info.worksheets[0];
					        // log the sheet to get the id
					        console.log(sheet1);
					    });
	    				var currentMonth = new Date().getMonth();
	    				/*
	    					Insert current months records to the sheet and everything to history
	    					sheet
	    				*/
	    				var insertRows = function(output){
	    					for (i = 1; i < output.length; i++) { 
							    var record = output[i];
							    var date = new Date(record[0]);
							    var dataObj = {
							    	date : record[0],
							    	category: record[2],
							    	amount: record[3],
							    	currency: record[4],
							    	description : record[6]
							    };
							    // Check for current month
							    if (date.getMonth() == currentMonth){
								    my_sheet.addRow( TRANSACTION_SHEET_ID, dataObj );
							    }
							    my_sheet.addRow(HISTORY_SHEET_ID, dataObj);
							}
							//hook.res.end("Success");
	    				}
	    				/*
	    					Delete all rows of the current month on the sheet. This is because
	    					there is no id for the record.
	    				*/
	    				var deleteRows = function(row_data){
	    					for (j = 0; j < row_data.length; j++) {
					    		if(new Date(row_data[j].date).getMonth() == currentMonth){
					    			row_data[j].del();
					        	}
					    	}
	    				}
	    				/*
	    					Read the transaction sheet
	    				*/
	    				my_sheet.getRows( TRANSACTION_SHEET_ID, {
					        start: 1,          // start index 
					        num: 500,              // number of rows to pull 
					        orderby: 'date'  // column to order results by 
					    }, function(err, row_data){
					    	deleteRows(row_data);
					    	//Backup the transactions in the history sheet
			        		my_sheet.getRows( HISTORY_SHEET_ID, {
						        start: 1,          // start index 
						        num: 2000,              // number of rows to pull 
						        orderby: 'date'  // column to order results by 
						    }, function(err, row_data){
						    	// delete everything before
						    	for (j = 0; j < row_data.length; j++) {
						    		row_data[j].del();
						    	}
						    	call the function to insert history and transaction rows
						    	insertRows(output);
						    });
					    });
					});
			});
	    });	
	}catch(e){
		console.log(e);
	}
};
// Running locally using Node.
module['exports']({params: {secret: "dgfdg45345jf0248234234" ,attachmentURL:"CSV URL"}});
```
