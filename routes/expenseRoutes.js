const express = require('express');
const {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense
} = require('../controllers/expenseController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.use(auth);

router.get('/', getExpenses);
router.post('/', addExpense);
router.delete('/:id', deleteExpense);
router.put('/:id', updateExpense);

module.exports = router;
