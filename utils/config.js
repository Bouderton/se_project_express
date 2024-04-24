const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');



module.exports(NODE_ENV, JWT_SECRET);



