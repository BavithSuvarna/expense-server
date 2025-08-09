const Expense = require('../models/Expense');

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;

  try {
    const newExpense = new Expense({
      user: req.userId,
      title,
      amount,
      category,
      date,
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;

  const expenseFields = {};
  if (title) expenseFields.title = title;
  if (amount) expenseFields.amount = amount;
  if (category) expenseFields.category = category;
  if (date) expenseFields.date = date;

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    if (expense.user.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: expenseFields },
      { new: true }
    );

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    if (expense.user.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a category name for all related expenses (Handles new and existing names)
// @route   PUT /api/expenses/category/:oldCategory
// @access  Private
const updateCategory = async (req, res) => {
  const { oldCategory } = req.params;
  const { newCategory } = req.body;

  if (!newCategory || newCategory.trim() === '') {
    return res.status(400).json({ message: 'New category name is required.' });
  }

  try {
    // Uses a case-insensitive regular expression to find the category to rename.
    const findQuery = {
      user: req.userId,
      category: new RegExp('^' + oldCategory + '$', 'i'),
    };

    // This command updates all matching documents to the new category name.
    // It works whether 'newCategory' is a new name or an existing one.
    const result = await Expense.updateMany(
      findQuery,
      { $set: { category: newCategory } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: `No expenses found with category '${oldCategory}' for this user.` });
    }

    res.json({ message: `Category '${oldCategory}' was successfully updated to '${newCategory}'.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


module.exports = {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
  updateCategory,
};