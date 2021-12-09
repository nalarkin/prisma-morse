# Morse Lab API Example

## Important things to note

1. Must use MySQL server because the schema includes enums
2. Create a `.env` file and store the following line `DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@localhost:<PORT>/<DBNAME>`
   1. fill in the angled brackets with the info of your machine
   1. for example, a username of `joe` , password `pass` , port `9999`, with db `test`  would set the url as `mysql://joe:pass@localhost:9999/test`

## Missing features and future improvements

1. Create API endpoint to get all serializable and consumables in 1 request?
2. Search feature
   1. example of searching using express and prisma: https://github.com/prisma/prisma-examples/blob/latest/typescript/rest-nextjs-express/backend/src/index.ts
3. Image uploading to Google Drive
   1. Use google drive api
      1. `create` api endpoint is possible way to upload 
         1. https://developers.google.com/drive/api/v3/reference/files/create
4. Add Unit testing to API
   1. can use a built in library like Mocha/Chai
   2. can use Postman 
   2. https://dev.to/mhmdlotfy96/testing-nodejs-express-api-with-jest-and-supertest-1bk0
   2. https://www.prisma.io/docs/guides/testing/unit-testing
5. Create API documentation
   1. OpenAPI 3.0 is the standard format
6. Create link that can give users who signup with it admin permissions
7. Add OAuth2.0 sign in options (google, outlook, github, etc)



## Do this before deploying

1. Remove the `unsafePassword` attribute from `User` table so nobody's passwords are revealed
2. Adjust JWT access and refresh lifetimes
3. Generate new secure (with passphrase) JWT key token pair

