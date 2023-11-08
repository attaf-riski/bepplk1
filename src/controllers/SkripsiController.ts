import { Request, Response } from "express";
import Skripsi from "../db/models/Skripsi";
import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import uploadPDF from "../middleware/UploudPDF";

const CreateDataSkripsi = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM, status, nilai, tanggalSidang, lamaStudi } = req.body;
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

    const dataSkripsi = await Skripsi.findOne({
      where: {
        NIM: NIM,
      },
    });

    if (dataSkripsi) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Data Skripsi sudah ada", null, null));
    }

    const dataMasukkanSkripsi = {
      NIM: NIM,
      status: status,
      nilai: nilai,
      tanggalSidang: tanggalSidang,
      lamaStudi: lamaStudi,
      scanBeritaAcara: "",
      verified: false,
    };

    // pengecekan status: belum ambil, sedang ambil, lulus
    if (status == "belum ambil") {
      dataMasukkanSkripsi.nilai = 0;
      dataMasukkanSkripsi.tanggalSidang = Date.now();
      dataMasukkanSkripsi.lamaStudi = 0;
    } else if (status == "sedang ambil") {
      dataMasukkanSkripsi.nilai = 0;
      dataMasukkanSkripsi.tanggalSidang = Date.now();
      dataMasukkanSkripsi.lamaStudi = 0;
    } else if (status == "lulus") {
      dataMasukkanSkripsi.nilai = nilai;
      dataMasukkanSkripsi.tanggalSidang = tanggalSidang;
      dataMasukkanSkripsi.lamaStudi = lamaStudi;
    }

    const dataSkripsiKirim = await Skripsi.create(dataMasukkanSkripsi);

    if (!Skripsi) {
      return res
        .status(500)
        .send(
          Helper.ResponseData(
            500,
            "Gagal menambahkan data Skripsi untuk NIM " + NIM,
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
          "Berhasil menambahkan data Skripsi untuk NIM " + NIM,
          null,
          dataSkripsiKirim
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mengubah data Skripsi untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

const CreateSkripsiScanSkripsi = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;
  try {
    await uploadPDF(req, res);
    const scanSkripsi = req.file?.filename || "";
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

    const dataSkripsi = await Skripsi.findOne({
      where: {
        NIM: NIM,
      },
    });

    if (!dataSkripsi) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Data Skripsi tidak ada", null, null));
    }

    dataSkripsi.scanBeritaAcara = scanSkripsi;

    await dataSkripsi.save();

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah scan Skripsi untuk NIM " + NIM,
          null,
          dataSkripsi
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mengubah data Skripsi untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

const UpdateDataSkripsi = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { status, nilai, tanggalSidang, lamaStudi, verified } = req.body;
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
      lamaStudi: lamaStudi,
      verified: verified,
      scanBeritaAcara: "",
    };

    // pengecekan status: belum ambil, sedang ambil, lulus
    if (status == "belum ambil") {
      data.nilai = 0;
      data.tanggalSidang = Date.now();
      data.lamaStudi = 0;
    } else if (status == "sedang ambil") {
      data.nilai = 0;
      data.tanggalSidang = Date.now();
      data.lamaStudi = 0;
    } else if (status == "lulus") {
      data.nilai = nilai;
      data.tanggalSidang = tanggalSidang;
      data.lamaStudi = lamaStudi;
    }

    const dataSkripsi = await Skripsi.findOne({
      where: {
        NIM: NIM,
      },
    });

    data.scanBeritaAcara = dataSkripsi?.scanBeritaAcara || "";

    if (!dataSkripsi) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Data Skripsi tidak ada", null, null));
    }

    console.log(data);

    await Skripsi.update(data, {
      where: {
        NIM: NIM,
      },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah data Skripsi untuk NIM " + NIM,
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
          "Gagal mengubah data Skripsi semester untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

const GetSkripsiByNIM = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;
  try {
    const dataSkripsi = await Skripsi.findOne({
      where: {
        NIM: NIM,
      },
    });

    if (!dataSkripsi) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(404, "Data Skripsi untuk tidak ada", null, null)
        );
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data Skripsi semester untuk NIM " + NIM,
          null,
          dataSkripsi
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data Skripsi semester untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

const CreateSkripsiScanBeritaAcara = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;
  try {
    await uploadPDF(req, res);
    const scanSkripsi = req.file?.filename;
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

    const dataKHS = await Skripsi.findOne({
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
      scanBeritaAcara: scanSkripsi || "",
    };

    await Skripsi.update(data, {
      where: {
        NIM: NIM,
      },
    });

    dataKHS.scanBeritaAcara = scanSkripsi || "";

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
  CreateDataSkripsi,
  UpdateDataSkripsi,
  GetSkripsiByNIM,
  CreateSkripsiScanSkripsi, 
  CreateSkripsiScanBeritaAcara,
};
