# Morse Lab API Example

## [Design DOC](DESIGN-DOC.md)

## Requirements

1. have Node.js installed

2. (recommended) have yarn installed (if you don't you can install it using the below command )

   ```bash
   npm install --global yarn
   ```

3. Must use MySQL, as the schema includes enum. (Can't use sqlite)

## Quick Start

1. Create a `.env` file which must store the DATABASE_URL of your local MySQL running instance. See below for format

   ```yaml
   # Example .env File

   # Required DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@localhost:<PORT>/<DBNAME>
   # Example: if username is `joe` and password is `pass`, with sql running on port `9999` and the database name is `db`
   DATABASE_URL=mysql://joe:pass@localhost:9999/test

   # Optional. Changes the port that the server runs on, if not provided, defaults to port 8000
   PORT=8000
   ```

2. Navigate to the project root (same directory that contains the `project.json` file) and run the following commands

   ```bash
   # install all dependencies
   yarn

   # create the tabels in your connected MySQL database and create generated TypeScript types (that will be used for TS in express server)
   npx prisma generate

   # might run this automatically, but if it doesn't you can use this command.  populate the database with a small amount of randomly generated data
   yarn seed

   # start the server
   yarn dev

   ```

Other Useful Commands

```bash
# r for the API
yarn test

# open an interative browser view of the database you have, can edit/delete/add files
yarn studio

# run this when you make changes to the `schema.prisma` file located in ./prisma/schema.prisma
# give it a name with good descriptors
# recommend commiting your changes before you make changes, then switch to a new branch, then make changes to schema.prisma and then run migrate. This is because migration errors can result in catastrophic database failure.
yarn migrate

# scan all files to look for code style issues
yarn lint

# generate a new key pair that can be used for JWT asymmetric encryption
# key pair output is in directory ./src/auth/
# move generated key pair and overright the existing keys in ./src/auth/token/
yarn keypair

# add random data to database. Tells the prisma client to run the seed file at ./prisma/seed.ts
yarn seed
```

## TODO

1. Implement CRSF protection, see [express CSURF](https://github.com/expressjs/csurf) and [React CSRF protection guide](https://www.stackhawk.com/blog/react-csrf-protection-guide-examples-and-how-to-enable-it/)
   1. [Fairly detailed guide on Cross Site Request Forgery](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
   2. [JSON web token security guide for Java](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
   3. Other option: https://datatracker.ietf.org/doc/rfc8725/
   4. Best option might be to only use local storage, because supposedly this will only be an issue if using CDN, and that is not a requirement of this project

## Missing features and future improvements

1. Add additional column to transactions (can use this as a tutorial for Prisma with teammates) to track potential quantity change

   1. Can also possibly add a date returned? Should the processing be done on server or client side?

2. Create API endpoint to get all serializable and consumables in 1 request?
3. Search feature
   1. [example of searching using express and prisma](https://github.com/prisma/prisma-examples/blob/latest/typescript/rest-nextjs-express/backend/src/index.ts)
   1. probably will use [built in express `urlencoder`](https://expressjs.com/en/api.html#express.urlencoded)
4. Image uploading to Google Drive
   1. Use google drive api
      1. `create` [api endpoint is possible way to upload](https://developers.google.com/drive/api/v3/reference/files/create)
5. Add Unit testing to API
   1. can use a built in library like Mocha/Chai
   2. can use Postman
   3. [Guide using Jest and Super Test](https://dev.to/mhmdlotfy96/testing-nodejs-express-api-with-jest-and-supertest-1bk0) which is similar to what this project has.
   4. [Prisma guide on testing](https://www.prisma.io/docs/guides/testing/unit-testing)
6. Create API documentation
   1. OpenAPI 3.0 is the standard format
   2. [This could be useful for creating documentation](https://www.npmjs.com/package/swagger-ui-express)
7. Create link that can give users who signup with it admin permissions
8. Add OAuth2.0 sign in options (google, outlook, github, etc)

## Do this before deploying

1. Remove the `unsafePassword` attribute from `User` table so nobody's passwords are revealed
2. Adjust JWT access and refresh lifetimes
3. Generate new secure (with passphrase) JWT key token pair
