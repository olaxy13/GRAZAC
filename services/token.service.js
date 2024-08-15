/**
 * Generate verify email token
 * @param {User} user
 * @returns {<string>}
 */
const generateVerifyEmailToken = () => {
  const verifyEmailToken = Math.floor(Math.random() * 98776) + 10000;
  return verifyEmailToken;
};

module.exports = {
  generateVerifyEmailToken,
};