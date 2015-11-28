---
layout: post
title: Building a file transfering app using Firebase and Javascript
date: 2014-03-02 08:36:42
comments: true
categories: javascript
tags:
- firebase 
- file-transfer
- no-backend
disqus: y
share: y
---
This is not an intro post about [Firebase](https://www.firebase.com/) so I hope that you are familiar with Firebase operations and how Firebase generally works.

### Our problem domain
Our problem at hand was to send a file from one user to another user. More clearly stating - send data from user 1 to user 2 without having a custom backend server.

![User A wants to send file to User B](https://docs.google.com/drawings/d/1eOc7nuYHy6KKd3SWsBOVNeZWTd647AmxtIh2qJxaJMk/pub?w=535&h=254) 

### Proposed solution
Proposed solution is to build a handshake mechanism on Firebase without using a custom backend. Below is the architecture diagram of the solution.

![FileBus architecture](https://docs.google.com/drawings/d/1YemIAX8gWbeCW8_cn_nRf4kaGzgGJgxZZTlU1btzFt8/pub?w=806&h=477) 

<!-- more -->
#### Flow of requests
_Request A_ :- The client 1 will add a request to Firebase stating that a file is there to be shared to client 2. In Firebase how this is represented is by having a notification collection per user. 

``` json
	{
    "users": {
        "$userid": {
            "notifications": {
                "$notificationId1": {}
            }
        }
    }
}
``` 

An interesting point to note on Firebase is that we don't have arrays- [Arrays are reflected with id's](http://stackoverflow.com/a/15306616/813471). 

The key point here is that Client 1 is writing this to Client 2's notification list. Client 1 has write permission to Client 2 's notification collection but doesn't have read permission. Client 1 setup the values of `file_accepted`, `file_ready` as `false` by default and `file_require` as `true`.

``` json 
{
    "users": {
        "client_2": {
            "notifications": {
                "$notificationId1": {
                    "file_type": "txt",
                    "file_require": true,
                    "file_size": 4,
                    "file_name": "test",
                    "user": "client_1",
                    "file_accepted": false,
                    "file_ready": false
                }
            }
        }
    }
}
```

_Request B_ :- Client 2 is listening to his notification collection on child_added and child_changed [events](https://www.firebase.com/docs/reading-data.html). Child Added will be fired since Client 1 has added a notification to Client B's collection.

_Request C_ :- Client 2 will write a notification to Client 1's notification collection with the same notification changing the `file_accepted` to `true`, `user` to `client_2` and `recipient_notification` with notification id of the initial notification.

``` json
{
    "users": {
        "client_2": {
            "notifications": {
                "$notificationId1": {
                    "file_type": "txt",
                    "file_require": true,
                    "file_size": 4,
                    "file_name": "test",
                    "user": "client_1",
                    "file_accepted": false,
                    "file_ready": false
                }
            }
        },
        "client_1": {
            "notifications": {
                "$notificationId2": {
                    "file_type": "txt",
                    "file_require": false,
                    "file_size": 4,
                    "file_name": "test",
                    "user": "client_2",
                    "file_accepted": true,
                    "file_ready": false,
										"recipient_notification":"notificationId1"
                }
            }
        }
    }
}
```

_Request D_ :- Client 1 is also listening to child_added and child_changed events on his notification collection. A child_added event will be triggered and client A will upload the file to files collection of client 1. 

``` json 
{
    "users": {
        "client_1": {
            "notifications": {
                
            },
            "files": {
                "$file_name": {
                    "data": "$content",
                    "size": "$size",
                    "type": "$mimeType"
                }
            }
        }
    }
```



_Request E_ :- Client 1 will select client 2's notification by using `recipient_notification` and change the `file_ready` to `true` as well.

``` json
{
    "users": {
        "client_2": {
            "notifications": {
                "$notificationId1": {
                    "file_type": "txt",
                    "file_require": false,
                    "file_size": 4,
                    "file_name": "test",
                    "user": "client_1",
                    "file_accepted": false,
                    "file_ready": true
                }
            }
        },
        "client_1": {
            "notifications": {
                "$notificationId2": {
                    "file_type": "txt",
                    "file_require": false,
                    "file_size": 4,
                    "file_name": "test",
                    "user": "client_2",
                    "file_accepted": true,
                    "file_ready": false,
                    "recipient_notification": "notificationId1"
                }
            }
        }
    }
}
```

_There is a possible security hole here._ 

_Request F_ :- Since client 2 is listening to his collection his child_changed event get fired when client 1 changes the `file_ready` to `true`. Client 2 will then download the file from client 1's file collection. 

### Conclusion
Firebase proves to be a valuable service to perform realtime operations and file transfer using handshake protocol is successful due to this. My next adventure would be to use WebRTC to power up the handshake. 