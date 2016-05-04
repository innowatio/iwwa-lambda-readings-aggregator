[![Build Status](https://travis-ci.org/innowatio/iwwa-lambda-readings-aggregator.svg?branch=master)](https://travis-ci.org/innowatio/iwwa-lambda-readings-aggregator)
[![codecov.io](https://codecov.io/github/innowatio/iwwa-lambda-readings-aggregator/coverage.svg?branch=master)](https://codecov.io/github/innowatio/iwwa-lambda-readings-aggregator?branch=master)
[![Dependency Status](https://david-dm.org/innowatio/iwwa-lambda-readings-aggregator.svg)](https://david-dm.org/innowatio/iwwa-lambda-readings-aggregator)
[![devDependency Status](https://david-dm.org/innowatio/iwwa-lambda-readings-aggregator/dev-status.svg)](https://david-dm.org/innowatio/iwwa-lambda-readings-aggregator#info=devDependencies)

# iwwa-lambda-readings-aggregator

Lambda function to aggregate readings.

## Deployment

This project deployment is automated with Lambdafile [`lambda-boilerplate`](https://github.com/lk-architecture/lambda-boilerplate/).

### Configuration

The following environment variables are needed to configure the function:

- `MONGODB_URL`
- `DEBUG`

### Run test

In order to run tests locally a MongoDB instance and a `MONGODB_URL` environment
param are needed.
Then, just run `npm run test` command.
