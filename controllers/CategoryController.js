const { Category, validate } = require("../models/CategoryModel");
const PageBuilder = require("../utils/pageBuilder");

/*
 * POST
 * Create New Category
 * */
exports.addCategory = async (req, res) => {
  //Validate Body
  let { error } = validate(req.body);
  if (error) res.send({ error: error.details[0].message });

  //Create and save new category
  let cat = new Category(req.body);
  cat
    .save()
    .then(category => {
      res.send(category);
    })
    .catch(err => res.status(400).send(err));
};

exports.findAllCategories = async (req, res) => {
  let size = req.query.size ? parseInt(req.query.size) : 10;
  let page = req.query.page ? parseInt(req.query.page) : 0;
  let lang = req.query.lang ? req.query.lang : "en";

  let totalElements = await Category.countDocuments();

  let categories = await Category.find()
    .select(lang)
    .limit(size)
    .skip(page * size);

  let pb = new PageBuilder(categories, size, totalElements, page);
  res.send(pb.renderData);
};

/*
 * GET
 * Find Category By Id
 * */
exports.findById = async (req, res) => {
  let lang = req.query.lang ? req.query.lang : "en";
  const category = await Category.findById(req.params.id).select(lang);

  category
    ? res.send({ data: category })
    : res.status(404).send({ error: "Category Not Found" });
};

/*
 * DELETE
 * Delete Category By Id
 * */
exports.deleteById = async (req, res) => {
  // Lookup category by id in database
  const category = await Category.findById(req.params.id);

  //  Delete if found, or trow not found
  category
    ? category
        .delete()
        .then(() => {
          res.send({ message: "Category Deleted!" });
        })
        .catch(err => res.status(500).send(err))
    : res.status(404).send({ error: "Category Not Found!" });
};

/*
 * PUT
 * Update Category
 * */
exports.updateByIdPut = async (req, res) => {
  const body = req.body;
  //Validate Body | Throw error if not valid
  let { error } = validate(body);
  if (error) res.status(400).send({ error: error.details[0].message });

  //Find category by id | Throw Error if not found
  let category = await Category.findById(req.params.id);
  if (!category) res.status(404).send({ error: "Category Not Found!" });

  //Replace old category with the new one
  category.en.category = body.en.category;
  category.id.category = body.id.category;

  category
    .save()
    .then(newCat => {
      return res.send(newCat);
    })
    .catch(err => res.status(500).send(err));
};

exports.updateByIdPatch = async (req, res) => {
  //Find category by id | Throw Error if not found
  let category = await Category.findById(req.params.id);
  if (!category) res.status(404).send({ error: "Category Not Found!" });

  let newCat = await category.updateOne({ $set: req.body }, { new: true });

  res.send(newCat);
};
