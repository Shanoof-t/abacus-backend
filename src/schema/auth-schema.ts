import Joi from "joi";

const signUp = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signIn = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const schema = {
  signUp,
  signIn,
};

export default schema;
