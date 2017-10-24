# messenger API reference

## General
base URL: `https://...com/api/v1`  
auth header: `Authorization: Bearer <token>`

## Overview
* [Authentication](#authentication)
* [Users](#users)
* [Messages](#messages)
* [Contacts](#contacts)

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
    "username": "user123"
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
    "contacts": [
        "<userObject>",
        "..."
    ]
}
```

#### GET `/user/search?q=<urlEncodedString>`
Returns a list of users whose mail _or_ username contains the queried string.
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
            "timestamp": "2017-10-20 19:47:27.870Z",
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
