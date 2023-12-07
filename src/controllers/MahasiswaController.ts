import IRS from "../db/models/IRS";
import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import { Request, Response } from "express";
import uploadImage from "../middleware/UploudImage";
import { Op } from "sequelize";
import sequelize, { Sequelize, col } from "sequelize/types/sequelize";
import KHS from "../db/models/KHS";
import PKL from "../db/models/PKL";
import Skripsi from "../db/models/Skripsi";
import PasswordHelper from "../helpers/PasswordHelper";
import User from "../db/models/User";
import fs from "fs";
import DosenWali from "../db/models/DosenWali";

// create mahasiswa
const CreateMahasiswa = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM, nama, angkatan, dosenWaliNIP, status } = req.body;
  const hashed = await PasswordHelper.PasswrodHashing("12345678");

  const random = Math.floor(1000 + Math.random() * 9000);
  const namaTrim: string = nama.replace(/\s/g, "");

  const newData: any = {
    NIM: NIM,
    nama: nama,
    alamat: "",
    kabkota: "",
    provinsi: "",
    angkatan: angkatan,
    jalurMasuk: "",
    email: "",
    noHP: "",
    status: status,
    photo:
      "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Transparent-Image.png",
    dosenWaliNIP: dosenWaliNIP,
    username: "MA" + namaTrim + random,
    roleId: 5,
    password: hashed,
    verified: true,
    active: true,
    userId: "",
  };

  const checkMahasiswa = await Mahasiswa.findOne({
    where: {
      NIM: NIM,
    },
  });

  if (checkMahasiswa) {
    return res
      .status(403)
      .send(
        Helper.ResponseData(
          403,
          "Mahasiswa dengan NIM " + NIM + " sudah ada",
          null,
          null
        )
      );
  }

  const user = await User.create({
    username: newData.username,
    email: "",
    password: hashed,
    active: true,
    verified: true,
    roleId: 5,
  });

  newData.userId = user.id;

  const createMahasiswa = await Mahasiswa.create(newData);

  const data = {
    ...createMahasiswa,
    username: newData.username,
  };

  return res
    .status(200)
    .send(
      Helper.ResponseData(
        200,
        "Berhasil membuat mahasiswa dengan NIM " + NIM,
        null,
        data
      )
    );
};

const GetMahasiswaByNIM = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;

  try {
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Unauthorized", null, null));
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data mahasiswa dengan NIM " + NIM,
          null,
          dataMahasiswa
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIM " + NIM,
          err,
          null
        )
      );
  }
};

const UpdataDataPhoto = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;

  try {
    await uploadImage(req, res);
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Unauthorized", null, null));
    }

    if (req.file == undefined) {
      return res
        .status(400)
        .send({ message: "Please upload an image for photo profile!" });
    }

    const data = {
      photo: "http://localhost:5502/images/" + req.file.filename,
    };

    // delete image mahasiswa with fs.unlinkSync
    if (
      dataMahasiswa.photo !==
      "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Transparent-Image.png"
    ) {
      // unlink image dengan alamat seperti ini
      // http://localhost:5502/images/image-1701671220465.jpeg
      const image = dataMahasiswa.photo!.split("/");
      const imageName = image[image.length - 1];
      fs.unlinkSync("./images/" + imageName);
    }

    await Mahasiswa.update(data, {
      where: { NIM: NIM },
    });

    return res
      .status(200)
      .send(Helper.ResponseData(200, "Photo Berhasil Di Uploud", null, data));
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mengubah photo mahasiswa dengan NIM " + NIM,
          err,
          null
        )
      );
  }
};

const UpdateData = async (req: Request, res: Response): Promise<Response> => {
  const { NIM } = req.params;
  const {
    nama,
    alamat,
    kabkota,
    provinsi,
    jalurMasuk,
    noHP,
    email,
    status,
    angkatan,
    dosenWaliNIP,
  } = req.body;

  try {
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Unauthorized", null, null));
    }
    const data = {
      NIM: NIM,
      angkatan: angkatan,
      nama: nama,
      alamat: alamat,
      kabkota: kabkota,
      provinsi: provinsi,
      jalurMasuk: jalurMasuk,
      noHP: noHP,
      email: email,
      status: status,
      photo: dataMahasiswa?.photo,
      userId: dataMahasiswa?.userId,
      dosenWaliNIP: dosenWaliNIP,
    };

    await Mahasiswa.update(data, {
      where: { NIM: NIM },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah data mahasiswa dengan NIM " + NIM,
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
          "Gagal mengubah data mahasiswa dengan NIM " + NIM,
          err,
          null
        )
      );
  }
};

const GetMahasiswaByUserId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userid } = req.params;

  try {
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { userId: userid },
    });

    const data = {
      NIM: dataMahasiswa?.NIM,
      nama: dataMahasiswa?.nama,
      alamat: dataMahasiswa?.alamat,
      kabkota: dataMahasiswa?.kabkota,
      provinsi: dataMahasiswa?.provinsi,
      angkatan: dataMahasiswa?.angkatan,
      jalurMasuk: dataMahasiswa?.jalurMasuk,
      email: dataMahasiswa?.email,
      noHP: dataMahasiswa?.noHP,
      status: dataMahasiswa?.status,
      photo: dataMahasiswa?.photo,
      userId: dataMahasiswa?.userId,
      dosenWaliNIP: dataMahasiswa?.dosenWaliNIP,
    };

    if (!dataMahasiswa) {
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
          "Berhasil mendapatkan data mahasiswa dengan NIM " + userid,
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
          "Gagal mendapatkan data mahasiswa dengan NIM " + userid,
          err,
          null
        )
      );
  }
};

const GetMahasiswaByKeywordAndDoswalNIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { keyword, doswalNIP } = req.params;

  try {
    const dataMahasiswa = await Mahasiswa.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                NIM: {
                  [Op.like]: "%" + keyword + "%",
                },
              },
              {
                nama: {
                  [Op.like]: "%" + keyword + "%",
                },
              },
            ],
          },
          {
            dosenWaliNIP: doswalNIP,
          },
        ],
      },
    });

    if (!dataMahasiswa) {
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
          "Berhasil mendapatkan data mahasiswa dengan NIP " + doswalNIP,
          null,
          dataMahasiswa
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIP " + doswalNIP,
          err,
          null
        )
      );
  }
};

const GetMahasiswaWithNotVerifiedIRSByBIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP, type } = req.params;

  try {
    const dataIRS = await IRS.findAll({
      where: {
        verified: type === "true" ? true : false,
      },
    });

    // ambil data mahasiswa berdasarkan NIM hasil dataIRS
    const dataMahasiswaDikirim: any = [];
    const dataMahasiswa = new Set();
    dataIRS.forEach(async (element) => {
      dataMahasiswa.add(element.NIM);
    });

    const dataMahasiswaValues = dataMahasiswa.values();
    for (const data of dataMahasiswaValues) {
      const dataMahasiswaBuf = await Mahasiswa.findOne({
        where: {
          [Op.and]: [
            {
              NIM: data || "",
            },
            {
              dosenWaliNIP: NIP,
            },
          ],
        },
      });

      if (dataMahasiswaBuf) {
        dataMahasiswaDikirim.push(dataMahasiswaBuf);
      }
    }
    if (!dataMahasiswa) {
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
          "Berhasil mendapatkan data mahasiswa dengan NIP " + NIP,
          null,
          dataMahasiswaDikirim
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const GetMahasiswaWithNotVerifiedKHSByBIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP, type } = req.params;

  try {
    const dataIRS = await KHS.findAll({
      where: {
        verified: type === "true" ? true : false,
      },
    });

    // ambil data mahasiswa berdasarkan NIM hasil dataIRS
    const dataMahasiswaDikirim: any = [];
    const dataMahasiswa = new Set();
    dataIRS.forEach(async (element) => {
      dataMahasiswa.add(element.NIM);
    });

    const dataMahasiswaValues = dataMahasiswa.values();
    for (const data of dataMahasiswaValues) {
      const dataMahasiswaBuf = await Mahasiswa.findOne({
        where: {
          [Op.and]: [
            {
              NIM: data || "",
            },
            {
              dosenWaliNIP: NIP,
            },
          ],
        },
      });

      if (dataMahasiswaBuf) {
        dataMahasiswaDikirim.push(dataMahasiswaBuf);
      }
    }
    if (!dataMahasiswa) {
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
          "Berhasil mendapatkan data mahasiswa dengan NIP " + NIP,
          null,
          dataMahasiswaDikirim
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const GetMahasiswaWithNotVerifiedPKLByBIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP, type } = req.params;

  try {
    const dataIRS = await PKL.findAll({
      where: {
        verified: type === "true" ? true : false,
      },
    });

    // ambil data mahasiswa berdasarkan NIM hasil dataIRS
    const dataMahasiswaDikirim: any = [];
    const dataMahasiswa = new Set();
    dataIRS.forEach(async (element) => {
      dataMahasiswa.add(element.NIM);
    });

    const dataMahasiswaValues = dataMahasiswa.values();
    for (const data of dataMahasiswaValues) {
      const dataMahasiswaBuf = await Mahasiswa.findOne({
        where: {
          [Op.and]: [
            {
              NIM: data || "",
            },
            {
              dosenWaliNIP: NIP,
            },
          ],
        },
      });

      if (dataMahasiswaBuf) {
        dataMahasiswaDikirim.push(dataMahasiswaBuf);
      }
    }
    if (!dataMahasiswa) {
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
          "Berhasil mendapatkan data mahasiswa dengan NIP " + NIP,
          null,
          dataMahasiswaDikirim
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const GetMahasiswaWithNotVerifiedSkripsiByBIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP, type } = req.params;

  try {
    const dataIRS = await Skripsi.findAll({
      where: {
        verified: type === "true" ? true : false,
      },
    });

    // ambil data mahasiswa berdasarkan NIM hasil dataIRS
    const dataMahasiswaDikirim: any = [];
    const dataMahasiswa = new Set();
    dataIRS.forEach(async (element) => {
      dataMahasiswa.add(element.NIM);
    });

    const dataMahasiswaValues = dataMahasiswa.values();
    for (const data of dataMahasiswaValues) {
      const dataMahasiswaBuf = await Mahasiswa.findOne({
        where: {
          [Op.and]: [
            {
              NIM: data || "",
            },
            {
              dosenWaliNIP: NIP,
            },
          ],
        },
      });

      if (dataMahasiswaBuf) {
        dataMahasiswaDikirim.push(dataMahasiswaBuf);
      }
    }
    if (!dataMahasiswa) {
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
          "Berhasil mendapatkan data mahasiswa dengan NIP " + NIP,
          null,
          dataMahasiswaDikirim
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const GetColorBox = async (req: Request, res: Response): Promise<Response> => {
  const { NIM } = req.params;
  const colorBox: any = [];

  for (let i: any = 1; i <= 14; i++) {
    const resultIRS = await IRS.findOne({
      where: {
        [Op.and]: [
          {
            NIM: NIM,
          },
          {
            semesterAktif: i,
          },
          {
            verified: true,
          },
        ],
      },
    });

    const resultKHS = await KHS.findOne({
      where: {
        [Op.and]: [
          {
            NIM: NIM,
          },
          {
            semesterAktif: i,
          },
          {
            verified: true,
          },
        ],
      },
    });

    const resultPKL = await PKL.findOne({
      where: {
        [Op.and]: [
          {
            NIM: NIM,
          },
          {
            semesterLulus: i,
          },
          {
            verified: true,
          },
        ],
      },
    });

    const resultSkripsi = await Skripsi.findOne({
      where: {
        [Op.and]: [
          {
            NIM: NIM,
          },
          {
            lamaStudi: i,
          },
          {
            verified: true,
          },
        ],
      },
    });
    if (resultSkripsi !== null) {
      colorBox.push({
        i: 4,
      });
    } else if (resultIRS !== null && resultKHS !== null) {
      if (resultPKL !== null) {
        colorBox.push({
          i: 3,
        });
      } else {
        colorBox.push({
          i: 2,
        });
      }
    } else {
      colorBox.push({
        i: 1,
      });
    }
  }

  return res
    .status(200)
    .send(
      Helper.ResponseData(
        200,
        "Berhasil Mendapatkan Color Box Mahasiswa " + NIM,
        null,
        colorBox
      )
    );
};

const GetMahasiswaByKeyword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { keyword } = req.params;

  try {
    const dataMahasiswa = await Mahasiswa.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                NIM: {
                  [Op.like]: "%" + keyword + "%",
                },
              },
              {
                nama: {
                  [Op.like]: "%" + keyword + "%",
                },
              },
              {
                angkatan: keyword,
              },
              {
                dosenWaliNIP: keyword,
              },
            ],
          },
        ],
      },
    });

    if (!dataMahasiswa) {
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
          "Berhasil mendapatkan data mahasiswa",
          null,
          dataMahasiswa
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(500, "Gagal mendapatkan data mahasiswa", err, null)
      );
  }
};

const DeleteDataMahasiswa = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;

  try {
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Unauthorized", null, null));
    }

    // delete image mahasiswa with fs.unlinkSync
    if (
      dataMahasiswa.photo !==
      "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Transparent-Image.png"
    ) {
      // unlink image dengan alamat seperti ini
      // http://localhost:5502/images/image-1701671220465.jpeg
      const image = dataMahasiswa.photo!.split("/");
      const imageName = image[image.length - 1];
      fs.unlinkSync("./images/" + imageName);
    }

    await IRS.destroy({
      where: { NIM: NIM },
    });

    await KHS.destroy({
      where: { NIM: NIM },
    });

    await PKL.destroy({
      where: { NIM: NIM },
    });

    await Skripsi.destroy({
      where: { NIM: NIM },
    });

    await User.destroy({
      where: { id: dataMahasiswa?.userId || "" },
    });

    await Mahasiswa.destroy({
      where: { NIM: NIM },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil menghapus data mahasiswa dengan NIM " + NIM,
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
          "Gagal menghapus data mahasiswa dengan NIM " + NIM,
          err,
          null
        )
      );
  }
};

const GetDashboardMahasiswa = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;

  const data = {
    DosenWali: "",
    StatusAkedemik: "",
    IPK: 0,
    SKSk: 0,
    Skripsi: "Sudah",
    PKL: "Belum",
  };

  try {
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Unauthorized", null, null));
    }

    const doswal = await DosenWali.findOne({
      where: {
        NIP: dataMahasiswa.dosenWaliNIP,
      },
    });

    const dataKHS = await KHS.findAll({
      where: {
        NIM: NIM,
      },
    });

    data.IPK = dataKHS.length !== 0 ? dataKHS[dataKHS.length - 1].IPK : 0;

    for (let i = 0; i < dataKHS.length; i++) {
      data.SKSk += dataKHS[i].jumlahSksSemester;
    }

    const dataPKL = await PKL.findOne({
      where: {
        NIM: NIM,
      },
    });

    const dataSkripsi = await Skripsi.findOne({
      where: {
        NIM: NIM,
      },
    });

    data.DosenWali = doswal?.nama || "";
    data.StatusAkedemik = dataMahasiswa.status || "";

    data.PKL = dataPKL !== null ? "Sudah" : "Belum";
    data.Skripsi = dataSkripsi !== null ? "Sudah" : "Belum";

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data dashboard mahasiswa dengan NIM " + NIM,
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
          "Gagal mendapatkan data dashboard mahasiswa dengan NIM " + NIM,
          err,
          null
        )
      );
  }
};

export default {
  CreateMahasiswa,
  UpdateData,
  GetMahasiswaByNIM,
  UpdataDataPhoto,
  GetMahasiswaByUserId,
  GetMahasiswaByKeywordAndDoswalNIP,
  GetMahasiswaWithNotVerifiedIRSByBIP,
  GetMahasiswaWithNotVerifiedKHSByBIP,
  GetMahasiswaWithNotVerifiedPKLByBIP,
  GetMahasiswaWithNotVerifiedSkripsiByBIP,
  GetColorBox,
  GetMahasiswaByKeyword,
  DeleteDataMahasiswa,
  GetDashboardMahasiswa,
};
