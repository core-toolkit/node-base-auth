const jose = require('jose');
const { createPublicKey } = require('crypto');

/**
 * @param {String} key
 * @param {String} algorithm
 */
module.exports = ({ Core: { Config: { auth: { key, algorithm } } } }) => {
  const cert = createPublicKey({
    key: Buffer.from(key, 'base64'),
    type: 'spki',
    format: 'der',
  });

  return {
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
  };
};
