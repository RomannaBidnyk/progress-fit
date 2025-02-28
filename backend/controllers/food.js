const Food = require("../models/Food");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllFoods = async (req, res) => {
  const foods = await Food.find({ createdBy: req.user.userId }).sort(
    "dateEaten" // Sort by dateEaten now
  );
  res.status(StatusCodes.OK).json({ foods, count: foods.length });
};

const getFood = async (req, res) => {
  const {
    user: { userId },
    params: { id: foodId },
  } = req;

  const food = await Food.findOne({
    _id: foodId,
    createdBy: userId,
  });
  if (!food) {
    throw new NotFoundError(`No food item found with id ${foodId}`);
  }
  res.status(StatusCodes.OK).json({ food });
};

const createFood = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const { name, calories, size, meal, dateEaten } = req.body;

  if (!name || !calories) {
    throw new BadRequestError("Name and calories are required fields.");
  }

  // Ensure dateEaten is a valid date if provided
  if (dateEaten && isNaN(new Date(dateEaten).getTime())) {
    throw new BadRequestError("Invalid date for dateEaten.");
  }

  const food = await Food.create({
    name,
    calories,
    size,
    meal,
    dateEaten,
    createdBy: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({ food });
};

const updateFood = async (req, res) => {
  const {
    body: { name, calories, size, meal, dateEaten },
    user: { userId },
    params: { id: foodId },
  } = req;

  if (!name || !calories) {
    throw new BadRequestError("Name and calories are required fields.");
  }

  // Ensure dateEaten is a valid date if provided
  if (dateEaten && isNaN(new Date(dateEaten).getTime())) {
    throw new BadRequestError("Invalid date for dateEaten.");
  }

  const food = await Food.findByIdAndUpdate(
    { _id: foodId, createdBy: userId },
    { name, calories, size, meal, dateEaten }, // Update the dateEaten as well
    { new: true, runValidators: true }
  );

  if (!food) {
    throw new NotFoundError(`No food item found with id ${foodId}`);
  }

  res.status(StatusCodes.OK).json({ food });
};

const deleteFood = async (req, res) => {
  const {
    user: { userId },
    params: { id: foodId },
  } = req;

  const food = await Food.findByIdAndDelete({
    _id: foodId,
    createdBy: userId,
  });
  if (!food) {
    throw new NotFoundError(`No food item found with id ${foodId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "The food item has been deleted." });
};

module.exports = {
  getAllFoods,
  getFood,
  createFood,
  updateFood,
  deleteFood,
};
