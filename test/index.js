const { MongoMemoryServer } = require('mongodb-memory-server');
const tester = require('acme-challenge-test');

// The dry-run tests can pass on, literally, 'example.com'
// but the integration tests require that you have control over the domain

const domain = 'example.com';
const lib = require('../');

let challenge;
let mongoServer;

MongoMemoryServer.create({
  instance: {
    dbName: 'mongodb-test',
  },
})
.then(mongod => {
  mongoServer = mongod;
  challenge = lib.create({
    datastore: {
      url: mongoServer.getUri(),
      database: 'mongodb-test',
    },
  });
})
.then(() => {
  return tester.testRecord('http-01', domain, challenge);
})
.then(function () {
  console.info('PASS');
})
.catch(function (err) {
  console.error('FAIL');
  console.error(err);
  process.exit(20);
})
.then(() => {
  challenge._data.close();
  return mongoServer.stop();
});
