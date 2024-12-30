import { RequestHandler } from "express";
import { ZodSchema } from "zod";


export default (schema: ZodSchema): RequestHandler =>
  function (req, res, next) {
    const { error } = schema.safeParse(req.body);
    if (error) {
      next(error);
    } else {
      next();
    }
  };
