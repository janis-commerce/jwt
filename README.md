# jwt

![Build Status](https://github.com/janis-commerce/api/workflows/Build%20Status/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/jwt/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/jwt?branch=master)
[![npm version](https://badge.fury.io/js/%40janiscommerce%2Fjwt.svg)](https://www.npmjs.com/package/@janiscommerce/jwt)

A helper to verify Janis JWTs

## Installation
```sh
npm install @janiscommerce/jwt
```

## API

### JWT

This is the main exported class. It has only one public method: `async verifyToken(token)`. This method will resolve the decoded token payload, or reject in case of error.

## Configuration

By default this package will handle JWKs properly, but you can configure a custom JWKS URI in case you want to test a different environment.

### Precedence

1. An options object with a `jwksUri` property when you instanciate JWT Class.
2. An environment variable named `JANISCOMMERCE_JWT_JWKS_URI`
3. Defaults to Janis ID Production URI

## Usage

```js
const { JWT } = require('@janiscommerce/jwt');

// Default behaviour, decodes with Janis Production JWKS URI
const jwt = new JWT();
const decodedToken = await jwt.verifyToken(token);

// Override default with an env var
process.env.JANISCOMMERCE_JWT_JWKS_URI = 'https://example.com/.well-known/jwks.json';
const envJwt = new JWT();
const envDecodedToken = await envJwt.verifyToken(token);

// Override by passing jwksUri option
const withOptionJwt = new JWT({
	jwksUri: 'https://override.com/.well-known/jwks.json'
});
const withOptionDecodedToken = await withOptionJwt.verifyToken(token);
```
