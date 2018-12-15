const mongoose = require("mongoose");
const Joi = require("joi");

const dataSchema = new mongoose.Schema({
  _id: false,
  category: {
    type: String,
    required: true
  }
});

const categorySchema = new mongoose.Schema({
  en: {
    type: dataSchema
  },
  id: {
    type: dataSchema
  }
});

const Category = mongoose.model("Category", categorySchema, 'categories');

function validateCategory(category) {
  const dataValidation = Joi.string()
    .min(2)
    .max(50)
    .required();

  const schema = {
    en: Joi.object().keys({
      category: dataValidation
    }),
    id: Joi.object().keys({
      category: dataValidation
    })
  };

  return Joi.validate(category, schema);
}

exports.Category = Category;
exports.validate = validateCategory;
