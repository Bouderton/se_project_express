const router = require('express').Router();
const { NOT_FOUND } = require('../utils/errors');

const userRouter = require('./users');
const itemsRouter = require('./clothingItems');

router.use('/users', userRouter);
router.use('/items', itemsRouter);

router.use((req, res) => res.status(NOT_FOUND).send({ message: 'Route not found' }));

module.exports = router;
