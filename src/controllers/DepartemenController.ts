import IRS from "../db/models/IRS";
import Departemen from "../db/models/Departemen";
import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import { Request, Response } from "express";
import uploadImage from "../middleware/UploudImage";
import PKL from "../db/models/PKL";
import { Op } from "sequelize";
import Skripsi from "../db/models/Skripsi";

const GetDepartemenByNIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataDepartemen = await Departemen.findOne({
      where: { NIP: NIP },
    });

    const data = {
      NIP: dataDepartemen?.NIP,
      nama: dataDepartemen?.nama,
      email: dataDepartemen?.email,
    };

    if (!dataDepartemen) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Unauthorized", null, null));
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data departemen dengan NIP " + NIP,
          null,
          data
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data departemen dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const UpdateData = async (req: Request, res: Response): Promise<Response> => {
  const { NIP } = req.params;
  const { nama, email } = req.body;

  try {
    const dataDepartemen = await Departemen.findOne({
      where: { NIP: NIP },
    });

    if (!dataDepartemen) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Unauthorized", null, null));
    }
    const data = {
      NIP: NIP,
      nama: nama,
      email: email,
    };

    await Departemen.update(data, {
      where: { NIP: NIP },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah data departemen dengan NIP " + NIP,
          null,
          data
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mengubah data departemen dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const GetDepartemenByUserId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userid } = req.params;

  try {
    const dataDepartemen = await Departemen.findOne({
      where: { userId: userid },
    });

    const data = {
      NIP: dataDepartemen?.NIP,
      nama: dataDepartemen?.nama,
      email: dataDepartemen?.email,
      userId: dataDepartemen?.userId,
    };

    if (!dataDepartemen) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Unauthorized For Get Data Departemen",
            null,
            null
          )
        );
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data departemen dengan NIP " + userid,
          null,
          data
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data departemen dengan NIP " + userid,
          err,
          null
        )
      );
  }
};

const GetDashboardDepartemen = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataDepartemen = await Departemen.findOne({
      where: { NIP: NIP },
    });

    const data = {
      jumlahMahasiswaWali: 0,
      jumlahMahasiswaLulusPKL: 0,
      jumlahMahasiswaLulusSkripsi: 0,
    };

    // tampilkan jumlah mahasiswa
    const return1 = await Mahasiswa.count({});

    data.jumlahMahasiswaWali = return1;

    // tampilkan jumlah mahasiswa yang telah lulus PKL
    const return2 = await PKL.count({
      where: { status: "Lulus" },
    });

    data.jumlahMahasiswaLulusPKL = return2;

    // tampilkan jumlah mahasiswa yang telah lulus Skripsi
    const return3 = await Skripsi.count({
      where: { status: "Lulus" },
    });

    data.jumlahMahasiswaLulusSkripsi = return3;

    if (!dataDepartemen) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Unauthorized bro", null, null));
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data departemen dengan NIP " + NIP,
          null,
          data
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data departemen dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

export default {
  UpdateData,
  GetDepartemenByNIP,
  GetDepartemenByUserId,
  GetDashboardDepartemen,
};
