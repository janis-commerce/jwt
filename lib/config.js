'use strict';

const DEFAULT_JWKS_URI = 'https://cdn.id.janis.in/.well-known/jwks.json';

module.exports = class Config {

	constructor(options) {
		this.options = options;
	}

	getJwksUri() {
		return this.options.jwksUri
			|| process.env.JANISCOMMERCE_JWT_JWKS_URI
			|| DEFAULT_JWKS_URI;
	}

};
