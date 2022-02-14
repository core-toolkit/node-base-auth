const jose = require('jose');
const { createPublicKey } = require('crypto');
const UserTokenMiddleware = require('../middleware/UserTokenMiddleware');

/**
 * @param {String} key
 * @param {String} algorithm
 */
module.exports = ({ Core: { Config: { auth: { key, algorithm, header } } } }) => {
  const cert = createPublicKey({
    key: Buffer.from(key, 'base64'),
    type: 'spki',
    format: 'der',
  });

  const iface = {
    /**
     * @param {String} token
     * @returns {Object}
     */
    async parse(token) {
      try {
        const { payload } = await jose.jwtVerify(token, cert, { algorithms: [algorithm] });
        return payload;
      } catch (_) {
        return {};
      }
    },

    getUserTokenMiddleware() {
      return UserTokenMiddleware(header, iface.parse);
    },
  };

  return iface;
};
