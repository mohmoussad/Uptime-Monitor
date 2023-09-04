const mongoose = require("mongoose");

const isValedObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


module.exports = {
  isValedObjectId,
};