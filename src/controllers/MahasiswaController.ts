import IRS from "../db/models/IRS";
import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import { Request, Response } from "express";
import uploadImage from "../middleware/UploudImage";

const GetMahasiswaByNIM = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;

  try {
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    const data = {
      NIM: dataMahasiswa?.NIM,
      nama: dataMahasiswa?.nama,
      angkatan: dataMahasiswa?.angkatan,
      status: dataMahasiswa?.status,
      photo: dataMahasiswa?.photo,
      userId: dataMahasiswa?.userId,
      dosenWaliNIP: dataMahasiswa?.dosenWaliNIP,
    };

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
          data
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
  const { nama, alamat, kabkota, provinsi, jalurMasuk, noHP, email, status } =
    req.body;

  try {
    const data = {
      nama: nama,
      alamat: alamat,
      kabkota: kabkota,
      provinsi: provinsi,
      jalurMasuk: jalurMasuk,
      noHP: noHP,
      email: email,
      status: status,
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
          null
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

export default {
  UpdateData,
  GetMahasiswaByNIM,
  UpdataDataPhoto,
  GetMahasiswaByUserId,
};
