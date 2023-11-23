import IRS from "../db/models/IRS";
import DosenWali from "../db/models/DosenWali";
import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import { Request, Response } from "express";
import uploadImage from "../middleware/UploudImage";
import PKL from "../db/models/PKL";
import { Op } from "sequelize";
import Skripsi from "../db/models/Skripsi";

const GetDosenWaliByNIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataDosenWali = await DosenWali.findOne({
      where: { NIP: NIP },
    });

    const data = {
      NIP: dataDosenWali?.NIP,
      nama: dataDosenWali?.nama,
      email: dataDosenWali?.email,
    };

    if (!dataDosenWali) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Unauthorized", null, null));
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data dosen wali dengan NIP " + NIP,
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
          "Gagal mendapatkan data dosen wali dengan NIP " + NIP,
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
    const dataDosenWali = await DosenWali.findOne({
      where: { NIP: NIP },
    });

    if (!dataDosenWali) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Unauthorized", null, null));
    }
    console.log(dataDosenWali);
    const data = {
      NIP: NIP,
      nama: nama,
      email: email,
    };

    await DosenWali.update(data, {
      where: { NIP: NIP },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah data dosen wali dengan NIP " + NIP,
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
          "Gagal mengubah data dosen wali dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const GetDosenWaliByUserId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userid } = req.params;

  try {
    const dataDosenWali = await DosenWali.findOne({
      where: { userId: userid },
    });

    const data = {
      NIP: dataDosenWali?.NIP,
      nama: dataDosenWali?.nama,
      email: dataDosenWali?.email,
      userId: dataDosenWali?.userId,
    };

    if (!dataDosenWali) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Unauthorized For Get Data Mahasiwa",
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
          "Berhasil mendapatkan data dosen wali dengan NIP " + userid,
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
          "Gagal mendapatkan data dosen wali dengan NIP " + userid,
          err,
          null
        )
      );
  }
};

const GetDashboardDoswal = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataDosenWali = await DosenWali.findOne({
      where: { NIP: NIP },
    });

    const data = {
      jumlahMahasiswaWali: 0,
      jumlahMahasiswaLulusPKL: 0,
      jumlahMahasiswaLulusSkripsi: 0,
    };

    // tampilkan jumlah mahasiswa yang diwali
    const return1 = await Mahasiswa.count({
      where: { dosenWaliNIP: NIP },
    });

    data.jumlahMahasiswaWali = return1;

    // tampilkan jumlah mahasiswa wali yang telah lulus PKL
    const return2 = await PKL.count({
      include: [
        {
          model: Mahasiswa,
          required: true,
          where: { dosenWaliNIP: NIP },
        },
      ],
      where: { status: "Lulus" },
    });

    data.jumlahMahasiswaLulusPKL = return2;

    // tampilkan jumlah mahasiswa wali yang telah lulus Skripsi
    const return3 = await Skripsi.count({
      include: [
        {
          model: Mahasiswa,
          required: true,
          where: { dosenWaliNIP: NIP },
        },
      ],
      where: { status: "Lulus" },
    });

    data.jumlahMahasiswaLulusSkripsi = return3;

    if (!dataDosenWali) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Unauthorized", null, null));
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data dosen wali dengan NIP " + NIP,
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
          "Gagal mendapatkan data dosen wali dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

export default {
  UpdateData,
  GetDosenWaliByNIP,
  GetDosenWaliByUserId,
  GetDashboardDoswal,
};
