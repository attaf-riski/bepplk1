import { Request, Response, NextFunction } from "express";
import Helper from "../helpers/Helper";
import Mahasiswa from "../db/models/Mahasiswa";

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
    if (!result) {
      return res
        .status(401)
        .send(Helper.ResponseData(401, "Unautorized Boss", null, null));
    }
    console.log(result);
    res.locals.userEmail = result?.email;
    res.locals.roleId = result?.roleId;
    res.locals.userId = result?.id;

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

const Operator = (req: Request, res: Response, next: NextFunction) => {
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
const MahasiswaAutho = (req: Request, res: Response, next: NextFunction) => {
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
// check apakah data mahasiswa sudah lengkap belum
const MahasiswaDataLengkap = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId;
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { userId: userId },
    });

    if (dataMahasiswa) {
      if (
        dataMahasiswa.nama ||
        dataMahasiswa.alamat ||
        dataMahasiswa.kabkota ||
        dataMahasiswa.provinsi ||
        dataMahasiswa.angkatan ||
        dataMahasiswa.jalurMasuk ||
        dataMahasiswa.email ||
        dataMahasiswa.noHP ||
        dataMahasiswa.photo // pengecekan apabila masih default tidak boleh, sekarang boleh dulu
      ) {
      } else {
        return res
          .status(403)
          .send(
            Helper.ResponseData(
              403,
              "Data Mahasiswa Belum Lengkap Tidak Bisa Melanjutkan Fitur, Harap lengkapi data",
              null,
              null
            )
          );
      }
    }
    next();
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

const MahasiswaNIM = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { NIM } = req.params;
    const NIMonDataBase = await Mahasiswa.findOne({
      where: { userId: res.locals.userId },
    });
    console.log(NIMonDataBase?.NIM);
    console.log(NIM);
    if (NIMonDataBase?.NIM != NIM) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Forbidden NIM", null, null));
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
  MahasiswaAutho,
  MahasiswaNIM,
  MahasiswaDataLengkap,
};
