const express = require('express');
const {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
  updateCategory, // <-- Import the new controller function
} = require('../controllers/expenseController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// This middleware will protect all routes defined below
router.use(auth);

// Routes for individual expenses
router.get('/', getExpenses);
router.post('/', addExpense);
router.delete('/:id', deleteExpense);
router.put('/:id', updateExpense);

// NEW: Route to update a category name across all of a user's expenses
router.put('/category/:oldCategory', updateCategory);

module.exports = router;