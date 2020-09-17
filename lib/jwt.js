'use strict';

const jsonwebtoken = require('jsonwebtoken');

const Config = require('./config');
const JWKS = require('./jwks');

module.exports = class JWT {

	constructor(options = {}) {
		this.config = new Config(options);
	}

	verifyToken(token) {
		return new Promise((resolve, reject) => {

			jsonwebtoken.verify(token, (...args) => this.getPublicKey(...args), {
				algorithms: ['RS256']
			}, (err, decoded) => {

				if(err)
					return reject(err);

				resolve(decoded);
			});

		});
	}

	getPublicKey(header, callback) {

		const jwksUri = this.config.getJwksUri();

		const jwksClient = JWKS.getJwksClient(jwksUri);

		jwksClient.getSigningKey(header.kid, (err, key) => {

			if(err)
				return callback(err);

			callback(null, key.getPublicKey());
		});
	}

};
