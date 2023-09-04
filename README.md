# Uptime-Monitor
Uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime, built using: Node, Express, MongoDB.

- [Features](#features)
- [Overall Design](#overall%20design)
    - [Database](#database)
    - [Endpoints](#Endpoints)
- [Usage](#usage)
- [API Documentation](#api%20documentation)
- [Testing Server](#testing%20server)



## Features:
- User Registration with Email Verification.
- CRUD Operations for URL Checks (GET, PUT, DELETE) restricted to the user who created the check.
- Notifications to Authenticated Users when URLs go down or come back up (via Email, Pushover, optional Webhook).
- Detailed Uptime Reports for URLs, including availability, average response time, and total uptime/downtime.
- Grouping of Checks by Tags for Report Filtering.

## Overall Design
### Database

![Database Design](<assets/Database Design.jpg>)


### Endpoints

|Endpoint|	HTTP | Method	Description|
| -- | -- | -- |
| User Endpoints |  |  |
|/api/user/signup|	POST|	User signup with email verification|
|/api/user/login|	POST|	User login|
|/api/user/verify/:emailVerificationCode|	GET	|Verify user email|
| Check Endpoints |  |  |
|/api/check/|	POST|	Create a check, start monitoring and generate report|
|/api/check/|	GET|	Get all checks (filter by tags)|
|/api/check/:id|	GET|	Get one check by id|
|/api/check/:id|	PUT|	Update a check|
|/api/check/:id|	DELETE|	Delete a check|
| Report Endpoints |  |  |
|/api/report/|	GET|	Get all reports (filter by tags)|
|/api/report/:id|	GET|	Get one report by id|



## Usage:

- Clone the repo: `git clone https://github.com/mohmoussad/Uptime-Monitor`
- Copy `.env.example` to `.env` and edit `.env`
    ```
    # Server
    SERVER_URL=             # Used to be sent in verification mail
    PORT=                   # Choose any port but check firstly it's not occubied

    # JWT
    JWT_SECRET_KEY=         # Choose secret key

    # Database
    # You can use Mongo on cloud or your local mongo, but this uri will not be used if you run the app using docker-compose (Check docker-compose file)
    MONGO_URI=                 
    DB_NAME=                # Choose any name   

    # Email Server
    # You can use any email server, I used https://mailtrap.io/
    EMAIL_SERVER_HOST=
    EMAIL_SERVER_PORT=
    EMAIL_SERVER_USER=
    EMAIL_SERVER_PASS=
    SENDER_EMAIL=
    ```
- Run the app:
    - Using npm: 
        ```
        npm install
        npm run devStart
        ```
    - Using docker:
        ```
        docker build . -t <container name>
        docker run -p <host port:container port>
        ```
    - Using docker-compose:
        ```
        docker-compose up
        ```


## API Documentation

### User 
#### Signup

Sign up a new user with email verification.

- URL: `/api/user/signup`
- Method: `POST`
- Request Body:
    ```
    {   "name": "Mohammad Moussad",   "email": "moh.moussad@gmail.com",   "password": "123456789" }
    ```
    

#### Verify Email
Verify a user's email using the email verification code.
- URL: `/api/user/verify/:emailVerificationCode`
- Method: `GET`
- Path Parameters:
    - `emailVerificationCode` (Required): The email verification code sent to the user's email.

#### Login
Log in an existing user.
- URL: `/api/user/login`
- Method: `POST`
- Request Body:
    ```
    {  "email": "moh.moussad@gmail.com",   "password": "123456789" }
    ```


### Check
#### Create a New Check

- URL:  `/api/check/`    
- Method:  `POST`
- Authentication:  Required (User must be logged in)
- Request Body:
    ```
    {   "name": "My Check",   "url": "https://example.com",   "protocol": "https",   "path": "/mypath",   "port": "443",   "webhook": "https://mywebhook.com",   "timeout": 5000,   "interval": 300000,   "threshold": 3,   "authentication": {     "username": "myusername",     "password": "mypassword"   },   "pushover": {     "userkey": "myuserkey",     "token": "mytoken"   },   "httpHeaders": [     {       "key": "Header1",       "value": "Value1"     },     {       "key": "Header2",       "value": "Value2"     }   ],   "assert": {     "statusCode": 200   },   "tags": ["tag1", "tag2"],   "ignoreSSL": false }
    ```

#### Get All Checks

Retrieve a list of all checks.

- URL:  `/api/check/`
- Method:  `GET`
- Authentication:  Required (User must be logged in)
- Query Parameters: 
    -   `tags` (Optional): Comma-separated list of tags to filter checks by.
    

#### Get Check by ID

Retrieve details of a specific check by its ID.

- URL:  `/api/check/:id`
- Method:  `GET`
- Authentication:  Required (User must be logged in)
- Path Parameters: 
    -   `id` (Required): The ID of the check to retrieve.

#### Update Check

Update an existing check.
- URL:  `/api/check/:id`
- Method:  `PUT`
- Authentication:  Required (User must be logged in)
- Path Parameters: 
    -   `id` (Required): The ID of the check to update.
- Request Body:  (Same as "Create a New Check")

#### Delete Check

Delete an existing check.
- URL:  `/api/check/:id`
- Method:  `DELETE`
- Authentication:  Required (User must be logged in)
- Path Parameters: 
    -   `id` (Required): The ID of the check to delete.

Here's the API documentation for your User controller:




### Report


#### Get Report by ID

Retrieve a specific report by its ID.
- URL: `/api/report/:id`
- Method: `GET`
- Path Parameters:
    - `id` (Required): The ID of the report.

#### Get All Reports

Retrieve all reports owned by the authenticated user, optionally filtered by tags.
- URL: `/api/report/`
- Method: `GET`
- Query Parameters:
    - `tags` (Optional): Comma-separated list of tags to filter reports by.


## Testing Server
I built a testing server using to facilitate testing different use cases like:
 - Different status codes
 - Threshold
 - Timeout
 - TCP servers

It's not so optmized, I just built it on the fly for testing purposes, You can find it [here](https://github.com/mohmoussad/Uptime-Monitor-Testing-Server)

