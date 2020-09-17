'use strict';

const assert = require('assert');
const { JwksClient } = require('jwks-rsa/lib/JwksClient');

const JWKS = require('../lib/jwks');

describe('JWKS', () => {

	describe('getJwksClient', () => {

		it('Should return a jwks-rsa client', async () => {
			const client = JWKS.getJwksClient();
			assert(client instanceof JwksClient);
		});

		it('Should return the same client for the same uri', async () => {
			const client1 = JWKS.getJwksClient();
			const client2 = JWKS.getJwksClient();
			assert.strictEqual(client1, client2);
		});

		it('Should return different clients for different uris', async () => {
			const client1 = JWKS.getJwksClient('https://example1.com/jwks.json');
			const client2 = JWKS.getJwksClient('https://example2.com/jwks.json');
			assert.notStrictEqual(client1, client2);
		});

	});
});
