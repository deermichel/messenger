# messenger API reference

## General
base URL: `https://api.....com`

## Overview
* [Authentication](#authentication)
* [Users](#users)
* [Messages](#messages)

## Endpoints

### Authentication

#### POST `/auth/register`
Registers a new user.
```json
// request parameters
{
    "mail": "user@gmail.com",
    "password": "<sha512-encrypted password.domain>",
    "username": "user123"
}

// response (if succeeded, status = 201)
{
    "token": "Asdf...XX23"
}
```

#### POST `/auth/login`
Logs an user in.
```json
// request parameters
{
    "password": "<sha512-encrypted password.domain>",
    "username": "user123"
}

// response (if succeeded, status = 200)
{
    "token": "Asdf...XX23"
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
    "id": "<userId>"
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
            "recipient": "<userId>",
            "sender": "<userId>",
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

}
```
