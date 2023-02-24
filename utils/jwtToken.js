const sendToken = async (user, statusCode, res) => {
  const token = await user.getJWTToken();

  const option = {
    httpOnly: true,
    expire: new Date(
      Date.now + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };

  return res.status(statusCode).cookie("token", token, option).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
