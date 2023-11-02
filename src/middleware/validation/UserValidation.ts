import Validator from "validatorjs";
import { Request, Response, NextFunction } from "express";
import User from "../../db/models/User";
import Helper from "../../helpers/Helper";

const RegisterValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const data = {
      name,
      email,
      password,
      confirmPassword,
    };

    const rules: Validator.Rules = {
      name: "required|string|max:50",
      email: "required|email",
      password: "required|string|min:8",
      confirmPassword: "required|string|min:8",
    };

    const validate = new Validator(data, rules);

    if (validate.fails()) {
      return res
        .status(400)
        .send(Helper.ResponseData(400, "Bad Request", validate.errors, null));
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      const errorData = {
        errors: {
          email: ["Email already used"],
        },
      };
      return res
        .status(400)
        .send(Helper.ResponseData(400, "Bad Request", errorData, null));
    }

    next();
  } catch (error: any) {
    return res
      .status(500)
      .send(Helper.ResponseData(500, "Internal Server Error", error, null));
  }
};

export default { RegisterValidation };
