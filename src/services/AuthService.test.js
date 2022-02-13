const { exportSPKI, generateKeyPair, SignJWT } = require('jose');
const AuthService = require('./AuthService');

const makeAuth = async () => {
  const keyPair = await generateKeyPair('EdDSA');
  const pubKey = await exportSPKI(keyPair.publicKey);
  const auth = AuthService({
    Core: {
      Config: {
        auth: {
          key: pubKey.split('\n')[1],
          algorithm: 'EdDSA',
        }
      }
    }
  });
  return { auth, keyPair };
};

describe('AuthService', () => {
  it('makes an auth service', async () => {
    const { auth } = await makeAuth();
    expect(auth).toBeInstanceOf(Object);
    expect(auth).toHaveProperty('parse', expect.any(Function));
  });

  describe('.parse()', () => {
    it('parses valid tokens', async () => {
      const { auth, keyPair } = await makeAuth();
      const token = await new SignJWT({ id: 123 }).setProtectedHeader({ alg: 'EdDSA' }).sign(keyPair.privateKey);
      const data = await auth.parse(token);
      expect(data).toBeInstanceOf(Object);
      expect(data).toHaveProperty('id', 123);
    });

    it('returns an empty object on expired tokens', async () => {
      const { auth, keyPair } = await makeAuth();
      const token = await new SignJWT({ id: 123 })
        .setProtectedHeader({ alg: 'EdDSA' })
        .setExpirationTime(0)
        .sign(keyPair.privateKey);

      const data = await auth.parse(token);
      expect(data).toBeInstanceOf(Object);
      expect(data).not.toHaveProperty('id');
    });

    it('returns an empty object on tokens signed with different private keys', async () => {
      const { auth } = await makeAuth();
      const other = await generateKeyPair('EdDSA');
      const token = await new SignJWT({ id: 123 }).setProtectedHeader({ alg: 'EdDSA' }).sign(other.privateKey);

      const data = await auth.parse(token);
      expect(data).toBeInstanceOf(Object);
      expect(data).not.toHaveProperty('id');
    });

    it('returns an empty object on invalid tokens', async () => {
      const { auth } = await makeAuth();
      const data = await auth.parse('foo');
      expect(data).toBeInstanceOf(Object);
    });
  });
});
