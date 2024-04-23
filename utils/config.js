const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "Secret_Key_Here",
        { expiresIn: "7d" },
      );
    
      return token;
}

module.exports(NODE_ENV, JWT_SECRET, generateToken);



