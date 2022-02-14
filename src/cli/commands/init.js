const supportedAlgos = ['EdDSA'];

module.exports = ({ algo, header }, { addToConfig, addAppToRoot }) => {
  if (!supportedAlgos.includes(algo)) {
    throw new Error(`Unsupported algorithm, ${algo}, must be one of: [${supportedAlgos.join(', ')}]`)
  }
  addToConfig('auth:config.js', { algo, header });
  addAppToRoot('Auth');
};
