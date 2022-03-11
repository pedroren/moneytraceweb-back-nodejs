const jwt = require('jsonwebtoken');
const {verifyToken} = require('../util/common')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === 'null') {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  const decodedToken = verifyToken(token);
  
  if (!decodedToken) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
