const token = authorization.replace("Bearer ", "");

const JWT_SECRET = require('../utils/config');

payload = jwt.verify(token, JWT_SECRET);

