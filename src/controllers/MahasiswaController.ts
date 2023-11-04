import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import { Request, Response } from "express";

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
      dosenWaliId: dataMahasiswa?.dosenWaliId,
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

const UpdateData = async (req: Request, res: Response): Promise<Response> => {
  const { NIM } = req.params;
  const { nama, status, photoUrl } = req.body;

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
      nama: nama,
      status: status,
      photoUrl: photoUrl,
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
export default { UpdateData, GetMahasiswaByNIM };
