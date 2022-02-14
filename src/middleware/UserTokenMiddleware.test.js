const UserTokenMiddleware = require('./UserTokenMiddleware');

describe('UserTokenMiddleware', () => {
  it('makes a user token middleware', () => {
    const middleware = UserTokenMiddleware();
    expect(middleware).toBeInstanceOf(Function);
  });

  it('parses tokens and attaches the user to the request', async () => {
    const parser = jest.fn((v) => `${v}baz` );
    const middleware = UserTokenMiddleware('foo', parser);

    const req = { get: (v) => `${v}bar` };
    const next = jest.fn();
    await middleware(req, undefined, next);

    expect(req.user).toBe('foobarbaz');
    expect(parser).toHaveBeenCalledWith('foobar');
    expect(next).toHaveBeenCalled();
  });
});
