# messenger API reference

## General
base URL: `https://...com/api/v1`  
socket URL: `<baseUrl>?auth_token=<token>`  
auth header: `Authorization: Bearer <token>`

## Overview
* [Authentication](#authentication)
* [Users](#users)
* [Messages](#messages)
* [Conversations](#conversations)
* [Contacts](#contacts)
* [Sockets](#sockets)

## Endpoints

### Authentication

#### POST `/auth/register`
Registers a new user.
```json
// request parameters
{
    "mail": "user@gmail.com",
    "password": "<sha512-encrypted password.domain>",
    "username": "user123 <format: [a-zA-Z0-9-_]+>"
}

// response (if succeeded, status = 201)
{
    "token": "Asdf...XX23",
    "user": "<userObject>"
}
```

#### POST `/auth/login`
Logs an user in.
```json
// request parameters
{
    "password": "<sha512-encrypted password.domain>",
    "username": "user123 <or> user@gmail.com"
}

// response (if succeeded, status = 200)
{
    "token": "Asdf...XX23",
    "user": "<userObject>"
}
```

#### POST `/auth/logout`
Logs an user out. - but no function in current authentication model!
```json
// no request parameters needed
// empty response (if succeeded, status = 204)
```

### Users

#### GET `/user/me`
Returns user object of the authenticated user.
```json
// response (if succeeded, status = 200)
{
    "mail": "user@gmail.com",
    "username": "user123",
    "id": "<userId>",
    "last_seen": "online <or> 2017-10-20T19:47:27.870Z",
    "contacts": [
        "<userObject>",
        "..."
    ]
}
```

#### GET `/user/search?q=<urlEncodedString>`
Returns a list of users whose mail **or** username contains the queried string.
```json
// response (if succeeded, status = 200)
{
    "users": [
        "<userObject>",
        "..."
    ]
}
```

### Messages

#### GET `/message/all`
Returns all messages sent by **and** to you.
```json
// response (if succeeded, status = 200)
{
    "messages": [
        {
            "recipient": "<userObject>",
            "sender": "<userObject>",
            "message": "hello world!",
            "timestamp": "2017-10-20T19:47:27.870Z",
            "id": "<messageId>"
        },
        {
            "..."
        }
    ]
}
```

#### GET `/message/filter/<userId>`
Returns messages sent between you and the specified user.
```json
// response (if succeeded, status = 200)
{
    "messages": [
        {
            "recipient": "<userObject>",
            "sender": "<userObject>",
            "message": "hello world!",
            "timestamp": "2017-10-20 19:47:27.870Z",
            "id": "<messageId>"
        },
        {
            "..."
        }
    ]
}
```

#### POST `/message/send`
Sends a message to another user.
```json
// request parameters
{
    "recipient": "<userId>",
    "message": "hello world!"
}

// response (if succeeded, status = 201)
{
    "message": "<messageObject>"
}
```

### Conversations

#### GET `/conversation/with/<userId>`
Returns the conversation between you and the specified user. If no such
conversation exists (e.g. among cs students), returns **null**.
```json
// response (if succeeded, status = 200)
{
    "messages": [
        "<messageObject>",
        "..."
    ],
    "participants": [
        "<userObject>",
        "..."
    ],
    "last_message": "<messageObject>",
    "id": "<conversationId>"
}
```

#### GET `/conversation/all`
Returns all conversations featuring you.
```json
// response (if succeeded, status = 200)
{
    "conversations": [
        "<conversationObject>",
        "..."
    ]
}
```

### Contacts

#### GET `/contact/all`
Returns a list of all contacts.
```json
// response (if succeeded, status = 200)
{
    "contacts": [
        "<userObject>",
        "..."
    ]
}
```

#### POST `/contact/add`
Adds a contact.
```json
// request parameters
{
    "user": "<userId>"
}

// response (if succeeded, status = 201)
{
    "contacts": [
        "<userObject>",
        "..."
    ]
}
```

#### POST `/contact/delete`
Removes a contact.
```json
// request parameters
{
    "user": "<userId>"
}

// response (if succeeded, status = 200)
{
    "contacts": [
        "<userObject>",
        "..."
    ]
}
```

### Sockets
Using socket.io as socket service.

#### How to connect
_Example for js socket.io library:_
```javascript
let socket = io.connect("<baseUrl>", {
    query: "auth_token=" + "<token>"
})
```

#### ON `connect`
Fired if authentication went right and everything is just waiting for
your awesome messages.  
_Example for js socket.io library:_
```javascript
socket.on("connect", () => {
    // connected
})
```

#### ON `disconnect`
Fired if client disconnected from server. Mostly caused by a network timeout or
if the server is down.  
_Example for js socket.io library:_
```javascript
socket.on("disconnect", (reason) => {
    // console.log(reason)
})
```

#### ON `error`
Well, go and fix it. Mostly caused by authentication problems (e.g. token expired).  
_Example for js socket.io library:_
```javascript
socket.on("error", (error) => {
    // console.log(error)
})
```

#### ON `message`
Listens to new messages which will be sent as a socket event to the recipient
**and** the sender.  
_Example for js socket.io library:_
```javascript
socket.on("message", (message) => {
    // message is a <messageObject>
})
```

#### ON `user`
Listens to user events (e.g. updated last_seen) which will be sent as a socket
event to all connected sockets.  
_Example for js socket.io library:_
```javascript
socket.on("user", (user) => {
    // user is a <userObject>
})
```
