const { User, validate } = require("../models/UserModel");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
/*
 * POST
 * Register new user
 * */
exports.register = async (req, res) => {
  let body = req.body;

  //Validate Body
  let { error } = validate(body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  //Validate user
  let isEmailExist = await User.findOne({ email: body.email });
  let isUsernameExist = await User.findOne({ username: body.username });
  if (isEmailExist)
    return res.status(400).send({ message: "Email already used!." });
  if (isUsernameExist)
    return res.status(400).send({ error: "Username already taken!" });

  let user = new User(
    _.pick(body, [
      "name",
      "email",
      "password",
      "username",
      "sex",
      "profileImage",
      "bio",
      "bornDate"
    ])
  );

  /*Set Default Avatar For User Profile*/
  user.profileImage =
    body.profileImage === undefined
      ? "https://via.placeholder.com/300"
      : body.profileImage;

  //Encrypt The Password Using bcrypt
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  //Save User To Database
  await user
    .save()
    .then(newUser => {
        const token = newUser.generateAuthToken();
        return res.header('Authorization', token).send(newUser);
    })
    .catch(err => res.status(500).send(err));
};

/*POST
 * Login with existing data
 * */
exports.login = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  let user =
    req.body.email === undefined
      ? await User.findOne({ username: req.body.username })
      : await User.findOne({ email: req.body.email });

  if (!user)
    return res.status(400).send({ error: "Invalid username or password." });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ error: "Invalid email or password." });

  const token = user.generateAuthToken();
  res.send({ token: token });
};

function validateLogin(req) {
  const schema =
    req.email === undefined
      ? {
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      : {
          email: Joi.string()
            .required()
            .email(),
          password: Joi.string().required()
        };

  return Joi.validate(req, schema);
}
