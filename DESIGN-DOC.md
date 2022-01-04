# Design Doc

## Context and scope

The goal of this application is to create back end server which exposes an API to allow for CRUD operations on inventory items. This server needs to manage or communicate with a persistent SQL database, and be run on a local Raspberry Pi. The estimated max number of users is 30, and the API will only be available through the local network.

---

## Goals and non-goals

### Goals

- provide a learning experience to creators in industry-used software
- rapid development
- perform CRUD operations on items within a the inventory items stored in persistent data
- allow checkout and return of serializable items
- assign user roles to represent different user permissions, which allow some APIs to only be accessible if user has a certain role
- provide means for registering users, logging in users, and persisting user login and user information
- privacy of user login information
- create application which is able to transition to serverless (possibly after initial deployment)

### Non-goals

- distributed systems
- scalability
- user experience with people outside the Morse Lab
- server-less

---

## Design

There are many backend options that could all be used as a solution. These include:

- Laravel (PHP)
- Flask (Python)
- Django (Python)
- Express.js Framework (JavaScript),
- Koa Framework (JavaScript)
- Ruby on Rails (Ruby)
- Spring Boot (Java)
- No-code Solutions (like Strapi and Ghost)
- Rocket (Rust)
- Tower (Rust)
- Warp (Rust)

When deciding which framework to select, we focused on the top three goals which were

1. providing experience in industry-used server software
2. provide rapid development
3. perform CRUD operations on items within persistent data storage.

While the <u>no-code solutions</u> would likely provide the most rapid development, but they would serve non purpose on fulfilling goal number 1. Because of this, no-code solutions were not used for this project.

The frameworks in Rust (<u>Rocket</u>, <u>Tower</u>, and <u>Warp</u>) were not used, because most of the team members have no experience with Rust, and the frameworks are not popular enough in the industry to justify usage.

<u>Laravel</u> was not used because of PHP unfamiliarity and PHP's decline over the past decade.

The application was migrated to <u>Express.js</u> for multiple reasons. Firstly, the Node library is significantly larger than all the other options, this allows for additional features to likely have a quick implementation. Due to the package options, we found many packages that provide solutions for the goals of this project. For example, there is a well designed and maintained Node package that provides substantial ORM capabilities (Prisma), which improves development time while allowing fine grain control over interactions with the database. For authentication, we can use the Passport Library. Express fulfills these three goals quite well, due to it's popularity in the industry, the vast availability of packages for future feature development, and the strong ORM capabilities with the Prisma package.

A large tradeoff of using Express.js is working with JavaScript during debugging and larger team development. If it was developed in pure JS, the cost of maintenance would likely increase greatly as each new feature and team member is added. To combat this, I recommend using TypeScript (a true superset of JS) instead of JS. This will improve code reliability, and lower the cost of maintenance as the project grows.

---

## System context diagram

![image-20211221163734397](https://i.imgur.com/AUgHh97.png)

This application is what connects the MySQL database with the front-end website. The front-end will make HTTP requests to API endpoints, this application will validate, process, possibly interact with the MySQL database, and perform the corresponding actions.

In the future, this graph may need to be updated when we incorporate a reverse proxy (nginx/apache) to be the middleman between the client's requests and the front-end and back-end of the application.

---

## APIs

### add later

/api/serializables

/api/consumables

/api/users

/api/auth/login

/api/auth/register

/api/auth/token/refresh

/api/transactions

/api/auth/reset

---

## Data Storage

The application must interact and store persistent data and the database must be stored on a local hard drive. This eliminates the possibility for the common solution of using a remote DaaS solution (DynamoDB, S3, Firebase, etc.).

MongoDB possibly could have been used as a local NoSQL document-based database. However, multiple team members were already familiar with NoSQL databases, so we chose to go with a relational database instead.

We chose to go with MySQL, because it is a popular RDMS, which means it has high compatibility with most packages that we could integrate into our application. The team members were also unfamiliar with relational databases, so this provides a good learning oppurtunity.

PostgreSQL could have been the best choice for industry-related experience and scalability. However, PostgreSQL would slow down the development due to it's increased complexity. Also PostgreSQL has slightly less support from various libraries.

---

## Alternatives Considered

<u>Django</u> was initially used during the first initial months of development. The advantages were that the team members were comfortable with Python, it provided fairly detailed documentation, easy support of providing CRUD operations, and providing moderate ORM built-in capabilities with the MySQL database. The disadvantages became too great, that the speed of development slowed with every additional feature. This was caused by Django's heavily abstracted interface, which allowed less fine-control of user authentication, user permissions, searching database features, and image uploading.

Django was selected over <u>Flask</u>. Unsure of the reasoning behind this, have teammates who decided fill out this area. What were the pros and cons between the two that led to selecting Django over Flask?

<u>Ruby on Rails</u> and <u>Spring Boot</u> were not selected due to lack of it being discussed during initial design phase. It could have been a good choice due to it's speed of development, popularity in the industry, and simple MVC design. Currently unsure of the ORM capabilities that these frameworks provide.

<u>Koa</u> could also be a solid option for the project. Further research is required to determine if the benefits of Koa outweigh the time cost of switching to Koa. The server uses Express.js because I underestimated the popularity of Koa. I did not give it enough evaluation time before starting the development using Express.js.

---

## Security

### Password Security

We learned that password hashing is significantly more secure than password encryption. We chose to go with Argon2ID, with the primary reasoning coming from this article https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

The best choices were Argon2ID and Scrypt, because they make GPU password cracking less efficient due to the memory usage. Argon2ID was selected over Scrypt because of the advice found in the link listed in the last paragraph.

Bcrypt is a very popular hashing algorithm. It would be a fine choice, as many companies like Dropbox, GitHub, and Yahoo! use it. To see publicly disclosed password hashing algorithms see https://pulse.michalspacek.cz/passwords/storages.

Based off conjecture, I believe that Bcrypt is incredibly popular for 2 reasons.

1. It is trivial to convert MD5 hashed passwords into Bcrypt hashed passwords. This allows databases which were stored with the (now very unsafe) MD5 hashing algorithm to be converted to higher security without requiring all users to reset their password.
2. The NPM package for Bcrypt is fairly full featured and popular, which makes implementation easier and makes larger companies feel that the package is more secure to use.

If our server was going to handle government secrets (thus needing FIPS-140 compliance), then PBKDF2 is the only modern choice. It's less secure than other options, but it is the only hashing algorithm that meets FIPS-140 compliance (I could be wrong about this).

Symmetric encryption should be avoided for this entire project.

Passwords will only be stored in their hashed version, this makes database leaks less harmful to the users. When a user logs in, the password will be compared to the hashed version, and see if it's a valid match. Plaintext/encrypted passwords should not be be within persistent storage at any time (outside of pre-alpha development phase).

A HTTPS should be obtained to ensure connections between the server and users are secure. It's easy to obtain one from https://letsencrypt.org/
