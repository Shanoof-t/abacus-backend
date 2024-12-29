import { RequestHandler } from "express";
import Joi from "joi";

export default (schema: Joi.ObjectSchema): RequestHandler =>
  function (req, res, next) {
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    } else {
      next();
    }
  };
