import IRS from "../db/models/IRS";
import Departemen from "../db/models/Departemen";
import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import { Request, Response } from "express";
import uploadImage from "../middleware/UploudImage";
import PKL from "../db/models/PKL";
import { Op } from "sequelize";
import Skripsi from "../db/models/Skripsi";
import User from "../db/models/User";
import PasswordHelper from "../helpers/PasswordHelper";

const GetDepartemenByNIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataDepartemen = await Departemen.findOne({
      where: { NIP: NIP },
    });

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
          dataDepartemen
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

const GetRekapSevenYearsPKL = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const thisYear = new Date().getFullYear();
  const allYear: any = [];

  for (let i = 6; i >= 0; i--) {
    let bufferSudah = 0;
    let bufferBelom = 0;
    // dapatkan mahasiswa yang lulus PKL untuk mahasiswa angkatan thisYear - i
    const mahasiswa = await Mahasiswa.findAll({
      where: {
        angkatan: thisYear - i,
      },
    });

    // dapatkan jumlah data mahasiswa yang sudah lulus PKL dari mahasiswa yang sudah didapatkan
    for (let j = 0; j < mahasiswa.length; j++) {
      const pkl = await PKL.findOne({
        where: {
          NIM: mahasiswa[j].NIM,
          status: "Lulus",
        },
      });

      if (pkl) {
        bufferSudah++;
      } else {
        bufferBelom++;
      }
    }

    allYear.push({
      tahun: thisYear - i,
      sudah: bufferSudah,
      belum: bufferBelom,
    });
  }

  return res
    .status(200)
    .send(
      Helper.ResponseData(
        200,
        "Berhasil mendapatkan data rekap 7 tahun terakhir",
        null,
        allYear
      )
    );
};

const GetDetailRekapSevenYearsPKL = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tahun, status } = req.params;

  const mahasiswa = await Mahasiswa.findAll({
    where: {
      angkatan: tahun,
    },
  });

  const data = [];
  // jika status Lulus maka tampilkan mahasiswa yang sudah lulus PKL
  // jika status selain lulus maka tampilkan mahasiswa yang belum lulus PKL

  if (status === "Lulus") {
    for (let i = 0; i < mahasiswa.length; i++) {
      const pkl = await PKL.findOne({
        where: {
          NIM: mahasiswa[i].NIM,
          status: "Lulus",
        },
      });

      if (pkl) {
        data.push({
          NIM: mahasiswa[i].NIM,
          nama: mahasiswa[i].nama,
          angkatan: mahasiswa[i].angkatan,
          nilai: pkl.nilai,
        });
      }
    }
  } else {
    for (let i = 0; i < mahasiswa.length; i++) {
      const pkl = await PKL.findOne({
        where: {
          NIM: mahasiswa[i].NIM,
          status: "Lulus",
        },
      });

      if (!pkl) {
        data.push({
          NIM: mahasiswa[i].NIM,
          nama: mahasiswa[i].nama,
          angkatan: mahasiswa[i].angkatan,
          nilai: 0,
        });
      }
    }
  }

  return res
    .status(200)
    .send(
      Helper.ResponseData(
        200,
        "Berhasil mendapatkan data rekap 7 tahun terakhir",
        null,
        data
      )
    );
};

const GetRekapSevenYearsSkripsi = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const thisYear = new Date().getFullYear();
  const allYear: any = [];

  for (let i = 6; i >= 0; i--) {
    let bufferSudah = 0;
    let bufferBelom = 0;
    // dapatkan mahasiswa yang lulus PKL untuk mahasiswa angkatan thisYear - i
    const mahasiswa = await Mahasiswa.findAll({
      where: {
        angkatan: thisYear - i,
      },
    });

    // dapatkan jumlah data mahasiswa yang sudah lulus PKL dari mahasiswa yang sudah didapatkan
    for (let j = 0; j < mahasiswa.length; j++) {
      const pkl = await Skripsi.findOne({
        where: {
          NIM: mahasiswa[j].NIM,
          status: "Lulus",
        },
      });

      if (pkl) {
        bufferSudah++;
      } else {
        bufferBelom++;
      }
    }

    allYear.push({
      tahun: thisYear - i,
      sudah: bufferSudah,
      belum: bufferBelom,
    });
  }

  return res
    .status(200)
    .send(
      Helper.ResponseData(
        200,
        "Berhasil mendapatkan data rekap 7 tahun terakhir",
        null,
        allYear
      )
    );
};

const GetDetailRekapSevenYearsSkripsi = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tahun, status } = req.params;

  const mahasiswa = await Mahasiswa.findAll({
    where: {
      angkatan: tahun,
    },
  });

  const data = [];
  // jika status Lulus maka tampilkan mahasiswa yang sudah lulus Skripsi
  // jika status selain lulus maka tampilkan mahasiswa yang belum lulus Skrispsi

  if (status === "Lulus") {
    for (let i = 0; i < mahasiswa.length; i++) {
      const skripsi = await Skripsi.findOne({
        where: {
          NIM: mahasiswa[i].NIM,
          status: "Lulus",
        },
      });

      if (skripsi) {
        data.push({
          NIM: mahasiswa[i].NIM,
          nama: mahasiswa[i].nama,
          angkatan: mahasiswa[i].angkatan,
          nilai: skripsi.nilai,
        });
      }
    }
  } else {
    for (let i = 0; i < mahasiswa.length; i++) {
      const skripsi = await Skripsi.findOne({
        where: {
          NIM: mahasiswa[i].NIM,
          status: "Lulus",
        },
      });

      if (!skripsi) {
        data.push({
          NIM: mahasiswa[i].NIM,
          nama: mahasiswa[i].nama,
          angkatan: mahasiswa[i].angkatan,
          nilai: 0,
        });
      }
    }
  }

  return res
    .status(200)
    .send(
      Helper.ResponseData(
        200,
        "Berhasil mendapatkan data rekap 7 tahun terakhir",
        null,
        data
      )
    );
};

const GetRekapStatusMahasiswa = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const thisYear = new Date().getFullYear();
  const data: any = [];

  for (let i = 6; i >= 0; i--) {
    let aktif = 0;
    let dropout = 0;
    let mangkir = 0;
    let cuti = 0;
    let lulus = 0;
    let undurdiri = 0;
    let meninggal = 0;
    // dapatkan data mahasiswa dengan angkatan thisYear - i

    const mahasiswa = await Mahasiswa.findAll({
      where: {
        angkatan: thisYear - i,
      },
    });

    // dapatkan data status mahasiswa dari mahasiswa yang sudah didapatkan
    for (let j = 0; j < mahasiswa.length; j++) {
      if (mahasiswa[j].status === "Aktif") {
        aktif++;
      } else if (mahasiswa[j].status === "DO") {
        dropout++;
      } else if (mahasiswa[j].status === "Mangkir") {
        mangkir++;
      } else if (mahasiswa[j].status === "Cuti") {
        cuti++;
      } else if (mahasiswa[j].status === "Lulus") {
        lulus++;
      } else if (mahasiswa[j].status === "Undur Diri") {
        undurdiri++;
      } else if (mahasiswa[j].status === "Meninggal") {
        meninggal++;
      }
    }

    data.push({
      tahun: thisYear - i,
      aktif: aktif,
      dropout: dropout,
      mangkir: mangkir,
      cuti: cuti,
      lulus: lulus,
      undurdiri: undurdiri,
      meninggal: meninggal,
    });
  }

  return res
    .status(200)
    .send(
      Helper.ResponseData(
        200,
        "Berhasil mendapatkan data mahasiswa dengan status ",
        null,
        data
      )
    );
};

const GetDetailRekapStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tahun, status } = req.params;

  const mahasiswa = await Mahasiswa.findAll({
    where: {
      angkatan: tahun,
      status: status,
    },
  });

  return res
    .status(200)
    .send(
      Helper.ResponseData(
        200,
        "Berhasil mendapatkan data mahasiswa dengan status",
        null,
        mahasiswa
      )
    );
};

const GetDepartemenByKeyword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { keyword } = req.params;

  try {
    const dataDepartemen = await Departemen.findAll({
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

    if (!dataDepartemen) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Data tidak ditemukan", null, null));
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data departemen dengan keyword " + keyword,
          null,
          dataDepartemen
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data departemen dengan keyword " + keyword,
          err,
          null
        )
      );
  }
};

const DeleteDepartemen = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataDepartemen = await Departemen.findOne({
      where: { NIP: NIP },
    });

    if (!dataDepartemen) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Unauthorized", null, null));
    }

    await Departemen.destroy({
      where: { NIP: NIP },
    });

    await User.destroy({
      where: { id: dataDepartemen.userId || "" },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil menghapus data departemen dengan NIP " + NIP,
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
          "Gagal menghapus data departemen dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const CreateDepartemen = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP, nama, email } = req.body;

  try {
    const dataDepartemen = await Departemen.findOne({
      where: { NIP: NIP },
    });

    if (dataDepartemen) {
      return res
        .status(409)
        .send(Helper.ResponseData(409, "NIP sudah terdaftar", null, null));
    }

    const dataUser = await User.findOne({
      where: { email: email },
    });

    if (dataUser) {
      return res
        .status(409)
        .send(Helper.ResponseData(409, "Email sudah terdaftar", null, null));
    }

    const data = {
      NIP: NIP,
      nama: nama,
      email: email,
      userId: NIP,
      username: "",
    };

    const hashed = await PasswordHelper.PasswrodHashing("12345678");
    const random = Math.floor(1000 + Math.random() * 9000);
    const namaTrim: string = nama.replace(/\s/g, "");

    const dataUserDepartemen = {
      username: namaTrim + random,
      email: email,
      password: hashed,
      active: true,
      verified: true,
      roleId: 3,
    };

    const response = await User.create(dataUserDepartemen);
    data.userId = response.id;
    data.username = response.username;

    await Departemen.create(data);

    return res
      .status(201)
      .send(
        Helper.ResponseData(
          201,
          "Berhasil membuat data departemen dengan NIP " + NIP,
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
          "Gagal membuat data departemen dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

export default {
  CreateDepartemen,
  UpdateData,
  GetDepartemenByNIP,
  GetDepartemenByUserId,
  GetDashboardDepartemen,
  GetRekapSevenYearsPKL,
  GetDetailRekapSevenYearsPKL,
  GetRekapSevenYearsSkripsi,
  GetDetailRekapSevenYearsSkripsi,
  GetRekapStatusMahasiswa,
  GetDetailRekapStatus,
  GetDepartemenByKeyword,
  DeleteDepartemen,
};
