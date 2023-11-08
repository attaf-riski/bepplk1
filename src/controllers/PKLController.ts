import { Request, Response } from "express";
import PKL from "../db/models/PKL";
import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import uploadPDF from "../middleware/UploudPDF";

const CreateDataPKL = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM, status, nilai, tanggalSidang, semesterLulus } = req.body;
  try {
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(404, "Data Mahasiswa Tidak Ditemukan", null, null)
        );
    }

    const dataPKL = await PKL.findOne({
      where: {
        NIM: NIM,
      },
    });

    if (dataPKL) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Data PKL sudah ada", null, null));
    }

    const dataMasukkanPKL = {
      NIM: NIM,
      status: status,
      nilai: nilai,
      tanggalSidang: tanggalSidang,
      semesterLulus: semesterLulus,
      scanBeritaAcara: "",
      verified: false,
    };

    // pengecekan status: belum ambil, sedang ambil, lulus
    if (status == "belum ambil") {
      dataMasukkanPKL.nilai = 0;
      dataMasukkanPKL.tanggalSidang = Date.now();
      dataMasukkanPKL.semesterLulus = 0;
    } else if (status == "sedang ambil") {
      dataMasukkanPKL.nilai = 0;
      dataMasukkanPKL.tanggalSidang = Date.now();
      dataMasukkanPKL.semesterLulus = 0;
    } else if (status == "lulus") {
      dataMasukkanPKL.nilai = nilai;
      dataMasukkanPKL.tanggalSidang = tanggalSidang;
      dataMasukkanPKL.semesterLulus = semesterLulus;
    }

    const dataPKLKirim = await PKL.create(dataMasukkanPKL);

    if (!PKL) {
      return res
        .status(500)
        .send(
          Helper.ResponseData(
            500,
            "Gagal menambahkan data PKL untuk NIM " + NIM,
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
          "Berhasil menambahkan data PKL untuk NIM " + NIM,
          null,
          dataPKLKirim
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mengubah data PKL untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

const CreatePKLScanPKL = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;
  try {
    await uploadPDF(req, res);
    const scanPKL = req.file?.filename || "";
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(404, "Data Mahasiswa Tidak Ditemukan", null, null)
        );
    }

    const dataPKL = await PKL.findOne({
      where: {
        NIM: NIM,
      },
    });

    if (!dataPKL) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Data PKL tidak ada", null, null));
    }

    dataPKL.scanBeritaAcara = scanPKL;

    await dataPKL.save();

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah scan PKL untuk NIM " + NIM,
          null,
          dataPKL
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mengubah data PKL untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

const UpdateDataPKL = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { status, nilai, tanggalSidang, semesterLulus, verified } = req.body;
  const { NIM } = req.params;
  try {
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(404, "Data Mahasiswa Tidak Ditemukan", null, null)
        );
    }

    const data = {
      NIM: NIM,
      status: status,
      nilai: nilai,
      tanggalSidang: tanggalSidang,
      semesterLulus: semesterLulus,
      verified: verified,
      scanBeritaAcara: "",
    };

    // pengecekan status: belum ambil, sedang ambil, lulus
    if (status == "belum ambil") {
      data.nilai = 0;
      data.tanggalSidang = Date.now();
      data.semesterLulus = 0;
    } else if (status == "sedang ambil") {
      data.nilai = 0;
      data.tanggalSidang = Date.now();
      data.semesterLulus = 0;
    } else if (status == "lulus") {
      data.nilai = nilai;
      data.tanggalSidang = tanggalSidang;
      data.semesterLulus = semesterLulus;
    }

    const dataPKL = await PKL.findOne({
      where: {
        NIM: NIM,
      },
    });

    data.scanBeritaAcara = dataPKL?.scanBeritaAcara || "";

    if (!dataPKL) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Data PKL tidak ada", null, null));
    }

    console.log(data);

    await PKL.update(data, {
      where: {
        NIM: NIM,
      },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah data PKL untuk NIM " + NIM,
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
          "Gagal mengubah data PKL semester untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

const GetPKLByNIM = async (req: Request, res: Response): Promise<Response> => {
  const { NIM } = req.params;
  try {
    const dataPKL = await PKL.findOne({
      where: {
        NIM: NIM,
      },
    });

    if (!dataPKL) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Data PKL untuk tidak ada", null, null));
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data PKL semester untuk NIM " + NIM,
          null,
          dataPKL
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data PKL semester untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

const CreatePKLScanBeritaAcara = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;
  try {
    await uploadPDF(req, res);
    const scanPKL = req.file?.filename;
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(404, "Data Mahasiswa Tidak Ditemukan", null, null)
        );
    }

    const dataKHS = await PKL.findOne({
      where: {
        NIM: NIM,
      },
    });

    if (!dataKHS) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Data KHS untuk semester tidak ada",
            null,
            null
          )
        );
    }

    const data = {
      scanBeritaAcara: scanPKL || "",
    };

    await PKL.update(data, {
      where: {
        NIM: NIM,
      },
    });

    dataKHS.scanBeritaAcara = scanPKL || "";

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah scan KHS semester untuk NIM " + NIM,
          null,
          dataKHS
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mengubah data KHS semester untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

export default {
  CreateDataPKL,
  UpdateDataPKL,
  GetPKLByNIM,
  CreatePKLScanPKL,
  CreatePKLScanBeritaAcara,
};
