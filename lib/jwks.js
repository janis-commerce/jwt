'use strict';

const jwksRsa = require('jwks-rsa');

const jwksClients = {};

module.exports = {
	getJwksClient: uri => {

		if(!jwksClients[uri]) {
			jwksClients[uri] = jwksRsa({
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 10,
				jwksUri: uri
			});
		}

		return jwksClients[uri];
	}
};
