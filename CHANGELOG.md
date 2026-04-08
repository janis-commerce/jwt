# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2026-04-08
### BREAKING CHANGES
- `jwks-rsa` v4 enforces the Node.js version range declared in that package (e.g. `^20.19.0`, `^22.12.0`, or `>=23.0.0`). Consumers on older Node versions must upgrade their runtime or stay on an older release of this package.

### Changed
- Bump `jsonwebtoken` to v9.x and `jwks-rsa` to v4.x for current Node.js runtimes.
- Align CI with Node.js 22.

### Fixed
- Tests: import `JwksClient` from the `jwks-rsa` package entry point (the internal path `jwks-rsa/lib/JwksClient` is no longer published in recent `jwks-rsa` versions).

## [1.0.0] - 2020-09-17
### Added
- JWT verify with default JWKS URI
- JWKS URI can be configured with an env var `JANISCOMMERCE_JWT_JWKS_URI` and `options.jwksUri`
