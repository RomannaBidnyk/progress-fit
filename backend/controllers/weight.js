const Weight = require("../models/Weight");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllWeights = async (req, res) => {
  const weights = await Weight.find({ createdBy: req.user.userId }).sort(
    "weightOnDate"
  );
  res.status(StatusCodes.OK).json({ weights, count: weights.length });
};

const getWeight = async (req, res) => {
  const {
    user: { userId },
    params: { id: weightId },
  } = req;

  const weight = await Weight.findOne({
    _id: weightId,
    createdBy: userId,
  });

  if (!weight) {
    throw new NotFoundError(`No weight entry with id ${weightId}`);
  }

  res.status(StatusCodes.OK).json({ weight });
};

const createWeight = async (req, res) => {
  const { weight, weightOnDate } = req.body;

  if (weight === undefined || weightOnDate === undefined) {
    throw new BadRequestError("Weight and Date are required");
  }

  req.body.createdBy = req.user.userId;

  const newWeight = await Weight.create(req.body);
  res.status(StatusCodes.CREATED).json({ newWeight });
};

const updateWeight = async (req, res) => {
  const {
    body: { weight, weightOnDate },
    user: { userId },
    params: { id: weightId },
  } = req;

  if (weight === undefined || weightOnDate === undefined) {
    throw new BadRequestError("Weight and Date cannot be empty");
  }

  const updatedWeight = await Weight.findByIdAndUpdate(
    { _id: weightId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedWeight) {
    throw new NotFoundError(`No weight entry with id ${weightId}`);
  }

  res.status(StatusCodes.OK).json({ updatedWeight });
};

const deleteWeight = async (req, res) => {
  const {
    user: { userId },
    params: { id: weightId },
  } = req;

  const weight = await Weight.findByIdAndDelete({
    _id: weightId,
    createdBy: userId,
  });

  if (!weight) {
    throw new NotFoundError(`No weight entry with id ${weightId}`);
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Weight entry deleted successfully." });
};

module.exports = {
  getAllWeights,
  getWeight,
  createWeight,
  updateWeight,
  deleteWeight,
};
