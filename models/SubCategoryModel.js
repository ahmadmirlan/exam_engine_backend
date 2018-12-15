const mongoose = require("mongoose");
const Category = mongoose.model("Category");
const Schema = mongoose.Schema;

const dataSchema = new mongoose.Schema({
  _id: false,
  subcategory: {
    type: String,
    required: true
  }
});

const subCategorySchema = new mongoose.Schema({
  en: {
    type: dataSchema
  },
  id: {
    type: dataSchema
  },
  category: {
    type: Schema.ObjectId,
    ref: Category
  }
});
/*
subCategorySchema.pre("validate", function(next) {
  const Category = mongoose.model("Category");

  let category = Category.findById(this.category);

  if (category) return next(new Error("School not found"));
  return next();
});*/

const SubCategory = mongoose.model(
  "SubCategory",
  subCategorySchema,
  "subcategories"
);

/*function validateSubCategory(subCategory) {
    const dataValidation = Joi.string()
        .min(2)
        .max(50)
        .required();

    const schema = {
        en: Joi.object().keys({
            subCategory: Joi.Object
            category: dataValidation,
        }),
        id: Joi.object().keys({
            category: dataValidation
        })
}*/

module.exports.SubCategory = SubCategory;
