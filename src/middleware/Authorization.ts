import { Request, Response, NextFunction } from "express";
import Helper from "../helpers/Helper";

const Authenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers["authorization"];
    const token = authToken && authToken.split(" ")[1];

    if (token === null) {
      return res
        .status(401)
        .send(Helper.ResponseData(401, "Unautorized", null, null));
    }
    // console.log("token" + token);
    const result = Helper.ExtractToken(token!);
    console.log("result" + result);
    if (!result) {
      return res
        .status(401)
        .send(Helper.ResponseData(401, "Unautorized Boss", null, null));
    }
    res.locals.userEmail = result?.email;
    res.locals.roleId = result?.roleId;

    next();
  } catch (err: any) {
    return res.status(500).send(Helper.ResponseData(500, "", err, null));
  }
};

const SuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleId = res.locals.roleId;
    if (roleId != "1") {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Forbidden", null, null));
    }
    next();
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

const Operator = (res: Response, req: Request, next: NextFunction) => {
  try {
    const roleId = res.locals.roleId;
    if (roleId != "2") {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Forbidden", null, null));
    }
    next();
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};
const Departemen = (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleId = res.locals.roleId;
    if (roleId != "3") {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Forbidden", null, null));
    }
    next();
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};
const DosenWali = (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleId = res.locals.roleId;
    if (roleId != "4") {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Forbidden", null, null));
    }
    next();
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};
const Mahasiswa = (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleId = res.locals.roleId;
    if (roleId != "5") {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Forbidden", null, null));
    }
    next();
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

export default {
  Authenticated,
  SuperAdmin,
  Operator,
  Departemen,
  DosenWali,
  Mahasiswa,
};
