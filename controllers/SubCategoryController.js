const { SubCategory } = require("../models/SubCategoryModel");
const _ = require("lodash");
const { Category } = require("../models/CategoryModel");
const mongoose = require("mongoose");

exports.createSubCategory = async (req, res) => {
  const body = req.body;

  if (!mongoose.Types.ObjectId.isValid(body.category))
    res.send({ error: "Invalid ObjectId For Category" });

  Category.findById(body.category)
    .then(category => {
      if (!category)
        res.status(404).send({ error: "The Given Id of Category Not Found" });
    })
    .catch(err => res.status(500).send(err));

  let subcategory = new SubCategory(_.pick(body, ["en", "id", "category"]));
  subcategory
    .save()
    .then(subCat => res.send(subCat))
    .catch(err => res.status(400).send(err));
};

exports.findAllSubCategory = async (req, res) => {
  let lang = req.query.lang ? req.query.lang : "en";

  let subCategories = await SubCategory.find()
    .select(lang)
    .populate("category", lang);

  if (!subCategories) res.send({ error: "Not Found" });

  res.send(subCategories);
};

exports.findSubCategoryById = async (req, res) => {
  let lang = req.query.lang ? req.query.lang : "en";

  let subCategory = await SubCategory.findById(req.params.id)
    .select(lang)
    .populate("category", lang);

  if (!subCategory)
    res.send({ error: "The Given Id of Subcategory is Not Found!" });

  res.send(subCategory);
};

exports.updateSubCategoryWihPUT = async (req, res) => {
  const body = req.body;

  let subCategory = await SubCategory.findById(req.params.id);

  if (!subCategory) return res.status(404).send({ error: "Subcategory Not Found!" });

  subCategory.id = body.id;
  subCategory.en = body.en;

  // Validate category is valid
  if (!mongoose.Types.ObjectId.isValid(body.category))
    return res.status(400).send({ error: "Category Id Not Valid" });
  let category = await Category.findById(body.category);
  if (!category) return res.status(404).send({ error: "Category Id Not Found!" });
  subCategory.category = body.category;
  subCategory.save().then(subCategory => {
    res.send(subCategory);
  }).catch(err => res.status(500).send(err));
};
