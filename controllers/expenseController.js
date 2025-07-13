const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

exports.addExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    const expense = new Expense({
      title,
      amount,
      category,
      date,
      user: req.userId
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add expense' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};

exports.updateExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category, date },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update expense' });
  }
};
