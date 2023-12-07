const helpers = require('../../helpers/helpers.js');
const dotenv = require('dotenv');
dotenv.config();
describe('Helper Functions', () => {
  // Test for hashPassword
  test('hashPassword should hash a password correctly', async () => {
    const password = 'testPassword123';
    const hashedPassword = await helpers.hashPassword(password);
    expect(hashedPassword).not.toBe(password);

  });

  // Test for generateToken
  test('generateToken should generate a token correctly', async () => {
    const id = 'testId';
    const isAdmin = true;
    const token = helpers.generateToken(id, isAdmin);
    expect(token).not.toBe(null);
  });

  // Test for refreshToken
  test('refreshToken should generate a refresh token correctly', async () => {
    const id = 'testId';
    const isAdmin = true;
    const refreshToken = helpers.refreshToken(id, isAdmin);
    expect(refreshToken).not.toBe(null);
  })

  
});
