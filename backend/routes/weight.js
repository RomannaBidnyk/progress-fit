const express = require("express");
const router = express.Router();
const {
  getAllWeights,
  getWeight,
  createWeight,
  updateWeight,
  deleteWeight,
} = require("../controllers/weight");

router.route("/").post(createWeight).get(getAllWeights);
router.route("/:id").get(getWeight).delete(deleteWeight).patch(updateWeight);

module.exports = router;
