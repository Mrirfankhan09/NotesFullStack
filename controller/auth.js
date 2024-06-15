const jwt = require('jsonwebtoken');
const fs = require('fs')
const path = require('path')
const publickey = fs.readFileSync(
    path.resolve(__dirname, '../publickey.key'),
    'utf-8'
);
// console.log(publickey)
const auth = (req, res, next) => {
  const token = req.header('Authorization').split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, publickey);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
