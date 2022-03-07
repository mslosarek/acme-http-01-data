const DataLayer = require('@slosarek/greenlock-data-layer');
const challenge = {};

module.exports = {
  create: (opts = {}) => {
    console.log({source: 'acme-http-01', opts});
    let config = {};

    config = {
      ...opts,
    };

    let request;

    const data = DataLayer(config);
    challenge._data = data;

    challenge.init = async (opts={}) => {
      request = opts.request || null;
      return null;
    };

    challenge.set = async (opts) => {
      const { challenge, domain } = opts;
      console.log('set opts:', { challenge, domain });
      await data.write('challenges', challenge.token, {
        domain,
        ...challenge
      });
      return null;
    };

    challenge.remove = async (opts) => {
      const { domain, challenge, query } = opts;
      console.log('remove opts:', { domain, challenge, query });
      await data.delete('challenges', challenge.token);
      return null;
    };

    challenge.get = async (opts) => {
      const { domain, challenge, query } = opts;
      console.log('get opts:', { domain, challenge, query });
      const { token, identifier } = challenge;
      if (token) {
        return data.read('challenges', token);
      }
      const allChallenges = await data.all('challenges');
      if (identifier && identifier.value) {
        return allChallenges.find(ch => {
          return ch.identifier.value === identifier.value;
        });
      }
      return null;
    };

    return challenge;
  },
};
