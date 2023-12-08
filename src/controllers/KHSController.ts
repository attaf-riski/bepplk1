import { Request, Response } from "express";
import { Op } from "sequelize";
import KHS from "../db/models/KHS";
import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import uploadPDF from "../middleware/UploudPDF";

const CreateDataKHS = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;
  const { semesterAktif, jumlahSksSemester, jumlahSksKumulatif, IPS, IPK } =
    req.body;
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

    const isKHSExist = await KHS.findOne({
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    if (isKHSExist) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Data KHS untuk semester " + semesterAktif + " sudah ada",
            null,
            null
          )
        );
    }

    const dataKHS = await KHS.create({
      NIM: NIM,
      semesterAktif: semesterAktif,
      jumlahSksSemester: jumlahSksSemester,
      jumlahSksKumulatif: jumlahSksKumulatif,
      IPS: IPS,
      IPK: IPK,
      scanKHS: "",
      verified: false,
    });

    if (!KHS) {
      return res
        .status(500)
        .send(
          Helper.ResponseData(
            500,
            "Gagal menambahkan data KHS semester " +
              semesterAktif +
              " untuk NIM " +
              NIM,
            null,
            dataKHS
          )
        );
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil menambahkan data KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
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
          "Gagal mengubah data KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          err,
          null
        )
      );
  }
};

const CreateKHSScanKHS = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { semesterAktif, NIM } = req.params;
  try {
    await uploadPDF(req, res);
    const scanKHS = req.file?.filename;
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

    const dataKHS = await KHS.findOne({
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    if (!dataKHS) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Data KHS untuk semester " + semesterAktif + " tidak ada",
            null,
            null
          )
        );
    }

    const data = {
      scanKHS: scanKHS || "",
    };

    // hapus file lama dengan fs.unlinkSync
    if (dataKHS.scanKHS != "") {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join("./pdf/" + dataKHS.scanKHS);
      fs.unlinkSync(filePath);
    }

    await KHS.update(data, {
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah scan KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
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
          "Gagal mengubah data KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          err,
          null
        )
      );
  }
};

const UpdateDataKHS = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { jumlahSksSemester, jumlahSksKumulatif, IPS, IPK, verified } =
    req.body;
  const { NIM, semesterAktif } = req.params;
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
      jumlahSksSemester: jumlahSksSemester,
      jumlahSksKumulatif: jumlahSksKumulatif,
      IPS: IPS,
      IPK: IPK,
      scanKHS: "",
      verified: verified,
    };

    const dataKHS = await KHS.findOne({
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    if (!dataKHS) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Data KHS untuk semester " + semesterAktif + " tidak ada",
            null,
            null
          )
        );
    }

    await KHS.update(data, {
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah data KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
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
          "Gagal mengubah data KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          err,
          null
        )
      );
  }
};

const GetKHSByNIMSemester = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM, semesterAktif } = req.params;
  try {
    const dataKHS = await KHS.findOne({
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    if (!dataKHS) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(
            404,
            "Data KHS untuk semester " + semesterAktif + " tidak ada",
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
          "Berhasil mendapatkan data KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
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
          "Gagal mendapatkan data KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          err,
          null
        )
      );
  }
};

const GetKHSAllByNIM = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;
  try {
    const dataKHS = await KHS.findAll({
      where: {
        NIM: NIM,
      },
    });

    if (!dataKHS) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(
            404,
            "Data KHS untuk NIM " + NIM + " tidak ada",
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
          "Berhasil mendapatkan data KHS untuk NIM " + NIM,
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
          "Gagal mendapatkan data KHS untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

const approveKHS = async (req: Request, res: Response): Promise<Response> => {
  const { NIM, semesterAktif } = req.params;
  const { statusApprove } = req.body;
  try {
    const dataIRS = await KHS.findOne({
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    if (!dataIRS) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(
            404,
            "Data KHS untuk semester " + semesterAktif + " tidak ada",
            null,
            null
          )
        );
    }

    const data = {
      verified: statusApprove,
    };

    await KHS.update(data, {
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil menyetujui data KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
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
          "Gagal menyetujui data KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          err,
          null
        )
      );
  }
};

const GetKHSAllByNIMNotVerified = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM, type } = req.params;
  try {
    const dataIRS = await KHS.findAll({
      where: {
        [Op.and]: [{ NIM: NIM }, { verified: type === "true" ? true : false }],
      },
    });

    if (!dataIRS) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(
            404,
            "Data KHS untuk NIM " + NIM + " tidak ada",
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
          "Berhasil mendapatkan data KHS untuk NIM " + NIM,
          null,
          dataIRS
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data KHS untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

const DeleteKHSByNIMSemester = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM, semesterAktif } = req.params;
  try {
    const dataKHS = await KHS.findOne({
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    if (!dataKHS) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(
            404,
            "Data KHS untuk semester " + semesterAktif + " tidak ada",
            null,
            null
          )
        );
    }

    // hapus scan KHS menggunakna fs.unlinkSync
    if (dataKHS.scanKHS != "") {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join("./pdf/" + dataKHS.scanKHS);
      fs.unlinkSync(filePath);
    }

    await KHS.destroy({
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil menghapus data KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
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
          "Gagal menghapus data KHS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          err,
          null
        )
      );
  }
};

export default {
  CreateDataKHS,
  UpdateDataKHS,
  GetKHSByNIMSemester,
  GetKHSAllByNIM,
  CreateKHSScanKHS,
  approveKHS,
  GetKHSAllByNIMNotVerified,
  DeleteKHSByNIMSemester,
};
