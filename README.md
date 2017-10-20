# messenger API reference
---

## General
base URL: `https://api.....com`

## Overview
* [Authentication](#authentication)
* [Messages](#messages)

## Endpoints

### Authentication

#### POST `/register`
Registers a new user.
```json
// request parameters
{
    "mail": "user@gmail.com",
    "password": "<sha512-encrypted password.domain>",
    "username": "user123",
}

// response (if succeeded, status = 201)
{
    "token": "Asdf...XX23"
}
```

#### POST `/login`
Logs an user in.
```json
// request parameters
{
    "password": "<sha512-encrypted password.domain>",
    "username": "user123",
}

// response (if succeeded, status = 200)
{
    "token": "Asdf...XX23"
}
```

#### POST `/logout`
Logs an user out. - but no function in current authentication model!
```json
// no request parameters needed
// empty response (if succeeded, status = 204)
```
