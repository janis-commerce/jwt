'use strict';

const assert = require('assert');

const sinon = require('sinon');

const jsonwebtoken = require('jsonwebtoken');
const JWKS = require('../lib/jwks');

const { JWT } = require('../lib');

// eslint-disable-next-line max-len
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijk3ZGNlMjJlLTQ0NGMtNGU2Yy05OWFhLTA2Y2MyMGZkZWFkZCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE2MDAzNTcxMDJ9.Dap0PLCkWS5IC2uMjY1WPpScy3GFBdFEIJUNQjIok3sfZ5lLJWhLwO40WIbr77I496taDm3Sd4uW0DN1wcsvkftsw2wQ9Lq7LYoxnx_Vl0NlrhPfnbxjq9B4IZcTT7BKe3ss6zE7QyJ9BIvT1qmdaiuNOTFWiZeh6sO2nEtn6qrCZeqbhK2Yphm-4GZMTpM1FZiXqsi48kmOdkOeuLzvfbNbV-I1ytzLHT2JGWlqX0q_CYj06hWiWFR0h3YVrlu5LCSUqZazNCYpv8SzVpwD2KAZWqiwsCBw5sOvKydTOnDBT4H_afDWD27da33Vqu9lo3KrBcd3qHyAUt7UkDJolQkQ6hUdjcAOi7wcWzpuHg_cETezcA7KI-mfZSVohbkd6VBdsUD9--33i_0WZqPlpXIhG1pdlYt6nBpkT3fuZHRO4_Ux99fQKKXghCFr6UKc9yLA21DIWfPN2kVDdpPSJ90UawWP_S9R1rQI2sNHHjIXXTwG7wmIC3ptfIW7zHNPS1tFw_apY7okypGl0SC4Ll5v95iarC4mBYavKTiEKAsCmReb9y4ySEqtCTxfJzezdegpI6Oe39D_iKV96GdMTS1fSL8bX5XuWWfPjcCmVFfowFk4xb-zMNjakeM5IbwrqjPIJ925VaoWABzP6RMtEJVHfy6SX0h9zzudaNDLjP8';
const publicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtgE6VpSQrNa0dGBxY4Y3
HCHoFgdQa5UGpGSNNlTDamgnTzK2zBBGwppNeYQlFcqcezbydhS4yXHKmq7xW07z
FLVMh8Zrr1OMQXJHHjmW5rOuHUuPL91hsX7Ioug4exZxN8RBb10uXqGuv7ly9ZO8
Pnm/en7hCwpmGVF2gpy5qTm+K+Anrw33d81ZbXh02Oe4Ipj2T9ZfLI9I9u4L4cZo
xQ3g+zSfbcCsEtlFPy0+sF/C3Io7yl8QnYRAU4KKZJiFKc6I0rKAaFEBfUO6ecJN
unX+SQXZq+P9yZkZ71MMAqvmQrMz8QkTV9yMg9d9mZbwY/ISGGGu6NtSCxLBF4/Y
Ur0k6xXWN88hTwUsf0SVkfSuLYPcTqRxMzhfm86rV2kf7uX016L7PHWVnNdkx42n
MW0GngSoTcf9fvd6aiBM1brBZElYQQS8imzRj4qpnc8OGB1D/h1foF+TCcC4NM+B
ohwSg1g2K+GoKwo6XyamFgFruCqxLfmGLFctJze6eEz1p1yeB+v97fBQywsWB6XY
IQNETSvH2INH4DrsgHRgzepUd7n4JmwfFCOyCfTjd6MGgipqwLqeXumjTte8NzEk
z8PM9iJ6DrVnCvvAeenIV4xtePFFcaWUt9hBf9r3yxWLM5qXje1CJnVZEEr61Dod
HpEuxzRUGujZfSjblMUHrl0CAwEAAQ==
-----END PUBLIC KEY-----`;

describe('JWT', () => {

	afterEach(() => sinon.restore());

	describe('Token decoding', () => {

		it('Should reject if decode key fails to be fetched', async () => {

			sinon.stub(jsonwebtoken, 'verify')
				.callsFake((tkn, key, options, cb) => cb(new Error('Internal failure')));

			const jwt = new JWT();
			await assert.rejects(() => jwt.verifyToken(token), {
				message: 'Internal failure'
			});
		});

		it('Should reject if token fails to be decoded', async () => {

			const getSigningKey = sinon.stub()
				.yields(new Error('Error fetching public key'));

			sinon.stub(JWKS, 'getJwksClient')
				.returns({
					getSigningKey
				});

			const jwt = new JWT();
			await assert.rejects(() => jwt.verifyToken(token), {
				message: 'error in secret or public key callback: Error fetching public key'
			});
		});

		it('Should resolve the decoded token if no errors occur', async () => {

			const getSigningKey = sinon.stub()
				.yields(null, {
					getPublicKey: () => publicKey
				});

			sinon.stub(JWKS, 'getJwksClient')
				.returns({
					getSigningKey
				});

			const jwt = new JWT();
			const decoded = await jwt.verifyToken(token);

			assert.deepStrictEqual(decoded, {
				foo: 'bar',
				iat: 1600357102
			});
		});
	});

	describe('JWKS Uri management', () => {

		let env;

		beforeEach(() => {
			env = { ...process.env };
		});

		afterEach(() => {
			process.env = env;
		});

		it('Should use the default URI if no options are passed', async () => {

			const getSigningKey = sinon.stub()
				.yields(null, {
					getPublicKey: () => publicKey
				});

			sinon.stub(JWKS, 'getJwksClient')
				.returns({
					getSigningKey
				});

			const jwt = new JWT();
			const decoded = await jwt.verifyToken(token);

			assert.deepStrictEqual(decoded, {
				foo: 'bar',
				iat: 1600357102
			});

			sinon.assert.calledOnceWithExactly(JWKS.getJwksClient, 'https://cdn.id.janis.in/.well-known/jwks.json');
		});

		it('Should use the provided URI if it is passed as options.jwksUri', async () => {

			const getSigningKey = sinon.stub()
				.yields(null, {
					getPublicKey: () => publicKey
				});

			sinon.stub(JWKS, 'getJwksClient')
				.returns({
					getSigningKey
				});

			const jwt = new JWT({
				jwksUri: 'https://as-option.example.com'
			});
			const decoded = await jwt.verifyToken(token);

			assert.deepStrictEqual(decoded, {
				foo: 'bar',
				iat: 1600357102
			});

			sinon.assert.calledOnceWithExactly(JWKS.getJwksClient, 'https://as-option.example.com');
		});

		it('Should use the provided URI if it is passed as env.JANISCOMMERCE_JWT_JWKS_URI', async () => {

			process.env.JANISCOMMERCE_JWT_JWKS_URI = 'https://as-env-var.example.com';

			const getSigningKey = sinon.stub()
				.yields(null, {
					getPublicKey: () => publicKey
				});

			sinon.stub(JWKS, 'getJwksClient')
				.returns({
					getSigningKey
				});

			const jwt = new JWT();
			const decoded = await jwt.verifyToken(token);

			assert.deepStrictEqual(decoded, {
				foo: 'bar',
				iat: 1600357102
			});

			sinon.assert.calledOnceWithExactly(JWKS.getJwksClient, 'https://as-env-var.example.com');
		});

		it('Should give precedence to options.jwksUri over env.JANISCOMMERCE_JWT_JWKS_URI', async () => {

			process.env.JANISCOMMERCE_JWT_JWKS_URI = 'https://as-env-var.example.com';

			const getSigningKey = sinon.stub()
				.yields(null, {
					getPublicKey: () => publicKey
				});

			sinon.stub(JWKS, 'getJwksClient')
				.returns({
					getSigningKey
				});

			const jwt = new JWT({
				jwksUri: 'https://as-option.example.com'
			});
			const decoded = await jwt.verifyToken(token);

			assert.deepStrictEqual(decoded, {
				foo: 'bar',
				iat: 1600357102
			});

			sinon.assert.calledOnceWithExactly(JWKS.getJwksClient, 'https://as-option.example.com');
		});
	});

});
