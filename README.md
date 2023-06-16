# learnhub-api

This repository hosts less soy-y rewrite of [LearnHub back-end](https://github.com/thinc-org/react-sharing-session-api-2022)
for Cleverse Academy participants.

It does not do Swagger, and strives to be very simple for introduction
to TypeScript back-end development using Express.

It tries to minimize any depedencies - as of now, only 3 are specified:

- `express`

  HTTP server

- `@prisma/client`

  Generated DB driver code from `prisma`.

- `jsonwebtoken`

  Generate, sign, and verify JWT

- `axios`

  (WILL be deprecated)

Only the bare minimum features will be implemented, so that participants
can later implement their own features in the classes.

For more complex back-end example, see [express-demo](https://github.com/artworkk/express-demo)
