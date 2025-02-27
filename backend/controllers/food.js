const Food = require("../models/Food");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllFoods = async (req, res) => {
  const foods = await Food.find({ createdBy: req.user.userId }).sort(
    "createdAt"
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

  const { name, calories, size, meal } = req.body;

  if (!name || !calories) {
    throw new BadRequestError("Name and calories are required fields.");
  }

  const food = await Food.create(req.body);
  res.status(StatusCodes.CREATED).json({ food });
};

const updateFood = async (req, res) => {
  const {
    body: { name, calories, size, meal },
    user: { userId },
    params: { id: foodId },
  } = req;

  if (!name || !calories) {
    throw new BadRequestError("Name and calories are required fields.");
  }

  const food = await Food.findByIdAndUpdate(
    { _id: foodId, createdBy: userId },
    { name, calories, size, meal },
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
