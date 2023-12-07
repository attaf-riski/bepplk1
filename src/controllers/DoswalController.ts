import IRS from "../db/models/IRS";
import DosenWali from "../db/models/DosenWali";
import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import { Request, Response } from "express";
import uploadImage from "../middleware/UploudImage";
import PKL from "../db/models/PKL";
import { Op } from "sequelize";
import Skripsi from "../db/models/Skripsi";
import User from "../db/models/User";
import PasswordHelper from "../helpers/PasswordHelper";

const GetDosenWaliByNIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataDosenWali = await DosenWali.findOne({
      where: { NIP: NIP },
    });

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
          dataDosenWali
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
      jumlahAntrianVerifikasiIRS: 0,
      jumlahAntrianVerifikasiKHS: 0,
      jumlahAntrianVerifikasiPKL: 0,
      jumlahAntrianVerifikasiSkripsi: 0,
      jumlahMahasiswaWali: 0,
      jumlahMahasiswaLulusPKL: 0,
      jumlahMahasiswaLulusSkripsi: 0,
    };

    // tampilkan jumlah antrian verifikasi IRS
    const return0 = await Mahasiswa.findAll({
      where: {
        dosenWaliNIP: NIP,
      },
    });

    // cari IRS yang belum diverifikasi hasil return0
    for (let i = 0; i < return0.length; i++) {
      const dataIRS = await IRS.count({
        where: {
          [Op.and]: [{ NIM: return0[i].NIM }, { verified: false }],
        },
      });

      if (dataIRS) {
        data.jumlahAntrianVerifikasiIRS += dataIRS;
      }
    }

    // cari KHS yang belum diverifikasi hasil return0
    for (let i = 0; i < return0.length; i++) {
      const dataKHS = await IRS.count({
        where: {
          [Op.and]: [{ NIM: return0[i].NIM }, { verified: false }],
        },
      });

      if (dataKHS) {
        data.jumlahAntrianVerifikasiKHS += dataKHS;
      }
    }

    // cari PKL yang diverifikasi hasil return0
    for (let i = 0; i < return0.length; i++) {
      const dataPKL = await PKL.count({
        where: {
          [Op.and]: [{ NIM: return0[i].NIM }, { verified: false }],
        },
      });

      if (dataPKL) {
        data.jumlahAntrianVerifikasiPKL += dataPKL;
      }
    }

    // cari Skripsi yang diverifikasi hasil return0
    for (let i = 0; i < return0.length; i++) {
      const dataSkripsi = await Skripsi.count({
        where: {
          [Op.and]: [{ NIM: return0[i].NIM }, { verified: false }],
        },
      });

      if (dataSkripsi) {
        data.jumlahAntrianVerifikasiSkripsi += dataSkripsi;
      }
    }

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

const GetAllDoswal = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dataDosenWali = await DosenWali.findAll();
    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data dosen wali",
          null,
          dataDosenWali
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(500, "Gagal mendapatkan data dosen wali", err, null)
      );
  }
};

const GetDoswalByKeyword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { keyword } = req.params;

  try {
    const dataDosenWali = await DosenWali.findAll({
      where: {
        [Op.or]: [
          {
            NIP: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            nama: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
    });
    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data dosen wali",
          null,
          dataDosenWali
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(500, "Gagal mendapatkan data dosen wali", err, null)
      );
  }
};

const DeleteDoswal = async (req: Request, res: Response): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataDosenWali = await DosenWali.findOne({
      where: { NIP: NIP },
    });

    if (!dataDosenWali) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Unauthorized", null, null));
    }

    await DosenWali.destroy({
      where: { NIP: NIP },
    });

    await User.destroy({
      where: { id: dataDosenWali?.userId || "" },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil menghapus data dosen wali dengan NIP " + NIP,
          null,
          null
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal menghapus data dosen wali dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const CreateDoswal = async (req: Request, res: Response): Promise<Response> => {
  const { NIP, nama, email } = req.body;

  try {
    const dataDosenWali = await DosenWali.findOne({
      where: { NIP: NIP },
    });

    if (dataDosenWali) {
      return res
        .status(409)
        .send(Helper.ResponseData(409, "NIP sudah terdaftar", null, null));
    }

    const data = {
      NIP: NIP,
      nama: nama,
      email: email,
      userId: 0,
      username: "",
    };

    const hashed = await PasswordHelper.PasswrodHashing("12345678");
    const random = Math.floor(1000 + Math.random() * 9000);
    const namaTrim: string = nama.replace(/\s/g, "");

    const dataUser = {
      username: namaTrim + random,
      email: email,
      password: hashed,
      active: true,
      verified: true,
      roleId: 4,
    };

    const dataUserCreated = await User.create(dataUser);

    data.userId = dataUserCreated.id;
    data.username = dataUserCreated.username;

    await DosenWali.create(data);

    return res
      .status(201)
      .send(
        Helper.ResponseData(
          201,
          "Berhasil menambahkan data dosen wali dengan NIP " + NIP,
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
          "Gagal menambahkan data dosen wali dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

export default {
  UpdateData,
  CreateDoswal,
  GetDosenWaliByNIP,
  GetDosenWaliByUserId,
  GetDashboardDoswal,
  GetAllDoswal,
  GetDoswalByKeyword,
  DeleteDoswal,
};
