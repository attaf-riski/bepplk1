import { Request, Response } from "express";
import User from "../db/models/User";
import Helper from "../helpers/Helper";

import PasswordHelper from "../helpers/PasswordHelper";
import Role from "../db/models/Role";

const Register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, roleId, confirmPassword } = req.body;
    const hashed = await PasswordHelper.PasswrodHashing(password);
    const user = await User.create({
      name,
      email,
      password: hashed,
      active: true,
      verified: true,
      roleId: roleId,
    });

    return res
      .status(201)
      .send(Helper.ResponseData(201, "User Created", null, user));
  } catch (error: any) {
    return res
      .status(500)
      .send(Helper.ResponseData(500, "Internal Server Error", error, null));
  }
};

const UserLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .send(Helper.ResponseData(401, "Unauthorized", null, null));
    }

    const matched = await PasswordHelper.PasswordCompare(
      password,
      user.password
    );

    if (!matched) {
      return res
        .status(401)
        .send(Helper.ResponseData(401, "Unauthorized", null, null));
    }

    const dataUser = {
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      verified: user.verified,
      active: user.active,
    };

    const token = Helper.GenerateToken(dataUser);
    const refreshToken = Helper.GenerateRefreshToken(dataUser);

    user.accessToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const responseUser = {
      ...dataUser,
      token: token,
    };

    return res
      .status(200)
      .send(Helper.ResponseData(200, "User OK", responseUser, null));
  } catch (error: any) {
    return res
      .status(500)
      .send(Helper.ResponseData(500, "Internal Server Error", error, null));
  }
};

const RefreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const refreshToken = await req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .send(Helper.ResponseData(401, "Unauthorized 1", null, null));
    }

    const decodedUser = Helper.ExtractRefreshToken(refreshToken);
    if (!decodedUser) {
      return res
        .status(401)
        .send(Helper.ResponseData(401, "Unauthorized 2", null, null));
    }

    const token = Helper.GenerateToken({
      name: decodedUser.name,
      email: decodedUser.email,
      roleId: decodedUser.roleId,
      verified: decodedUser.verified,
      active: decodedUser.active,
    });

    const resultUser = {
      ...decodedUser,
      token: token,
    };

    return res
      .status(200)
      .send(Helper.ResponseData(200, "OK", null, resultUser));
  } catch (error: any) {
    return res
      .status(500)
      .send(Helper.ResponseData(500, "Internal Server Error", error, null));
  }
};

const UserDetail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userEmail = res.locals.userEmail;
    const user = await User.findOne({
      where: {
        email: userEmail,
      },
      include: {
        model: Role,
        attributes: ["id", "rolName"],
      },
    });

    if (!user) {
      return res
        .status(401)
        .send(Helper.ResponseData(401, "Unauthorized", null, null));
    }

    return res.status(200).send(Helper.ResponseData(200, "OK", null, user));
  } catch (error: any) {
    return res
      .status(500)
      .send(Helper.ResponseData(500, "Internal Server Error", error, null));
  }
};

const UserLogout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const refreshToken = await req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(200)
        .send(Helper.ResponseData(200, "User Logout", null, null));
    }

    const userEmail = res.locals.userEmail;
    const user = await User.findOne({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      res.clearCookie("refreshToken");
      return res
        .status(200)
        .send(Helper.ResponseData(200, "User Logout", null, null));
    }

    await User.update({ accessToken: null }, { where: { email: userEmail } });
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .send(Helper.ResponseData(200, "User Logout", null, null));
  } catch (error: any) {
    return res
      .status(500)
      .send(Helper.ResponseData(500, "Internal Server Error", error, null));
  }
};

export default { Register, UserLogin, RefreshToken, UserDetail, UserLogout };
