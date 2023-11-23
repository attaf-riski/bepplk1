import { Request, Response } from "express";
import { Op } from "sequelize";
import IRS from "../db/models/IRS";
import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import uploadPDF from "../middleware/UploudPDF";

const CreateDataIRS = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { semesterAktif, jumlahSks, NIM } = req.body;
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

    const dataIRS = await IRS.findOne({
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    if (dataIRS) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Data IRS untuk semester " + semesterAktif + " sudah ada",
            null,
            null
          )
        );
    }

    const irs = await IRS.create({
      NIM: NIM,
      semesterAktif: semesterAktif,
      jumlahSks: jumlahSks,
      scanIRS: "",
      verified: false,
    });

    if (!irs) {
      return res
        .status(500)
        .send(
          Helper.ResponseData(
            500,
            "Gagal menambahkan data IRS semester " +
              semesterAktif +
              " untuk NIM " +
              NIM,
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
          "Berhasil menambahkan data IRS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          null,
          irs
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mengubah data IRS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          err,
          null
        )
      );
  }
};

const CreateIRSScanIRS = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { semesterAktif, NIM } = req.params;
  try {
    await uploadPDF(req, res);
    const scanIRS = req.file?.filename;
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

    const dataIRS = await IRS.findOne({
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    if (!dataIRS) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Data IRS untuk semester " + semesterAktif + " tidak ada",
            null,
            null
          )
        );
    }

    const data = {
      scanIRS: scanIRS || "",
    };

    await IRS.update(data, {
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah scan IRS semester " +
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
          "Gagal mengubah data IRS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          err,
          null
        )
      );
  }
};

const UpdateDataIRS = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { jumlahSks, verified } = req.body;
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
      jumlahSks: jumlahSks || 0,
      verified: verified || false,
    };

    const dataIRS = await IRS.findOne({
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    if (!dataIRS) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Data IRS untuk semester " + semesterAktif + " tidak ada",
            null,
            null
          )
        );
    }

    await IRS.update(data, {
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    const dataResult = {
      NIM: dataIRS.NIM,
      semesterAktif: dataIRS.semesterAktif,
      jumlahSks: jumlahSks,
      scanIRS: dataIRS.scanIRS,
      verified: verified,
    };

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah data IRS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          null,
          dataResult
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mengubah data IRS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          err,
          null
        )
      );
  }
};

const GetIRSByNIMSemester = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM, semesterAktif } = req.params;
  try {
    const dataIRS = await IRS.findOne({
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
            "Data IRS untuk semester " + semesterAktif + " tidak ada",
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
          "Berhasil mendapatkan data IRS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
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
          "Gagal mendapatkan data IRS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          err,
          null
        )
      );
  }
};

const GetIRSAllByNIM = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;
  try {
    const dataIRS = await IRS.findAll({
      where: {
        NIM: NIM,
      },
    });

    if (!dataIRS) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(
            404,
            "Data IRS untuk NIM " + NIM + " tidak ada",
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
          "Berhasil mendapatkan data IRS untuk NIM " + NIM,
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
          "Gagal mendapatkan data IRS untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

const approveIRS = async (req: Request, res: Response): Promise<Response> => {
  const { NIM, semesterAktif } = req.params;
  const { statusApprove } = req.body;
  try {
    const dataIRS = await IRS.findOne({
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
            "Data IRS untuk semester " + semesterAktif + " tidak ada",
            null,
            null
          )
        );
    }

    const data = {
      verified: statusApprove,
    };

    await IRS.update(data, {
      where: {
        [Op.and]: [{ NIM: NIM }, { semesterAktif: semesterAktif }],
      },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil menyetujui data IRS semester " +
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
          "Gagal menyetujui data IRS semester " +
            semesterAktif +
            " untuk NIM " +
            NIM,
          err,
          null
        )
      );
  }
};

const GetIRSAllByNIMNotVerified = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;
  try {
    const dataIRS = await IRS.findAll({
      where: {
        [Op.and]: [{ NIM: NIM }, { verified: false }],
      },
    });

    if (!dataIRS) {
      return res
        .status(404)
        .send(
          Helper.ResponseData(
            404,
            "Data IRS untuk NIM " + NIM + " tidak ada",
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
          "Berhasil mendapatkan data IRS untuk NIM " + NIM,
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
          "Gagal mendapatkan data IRS untuk NIM " + NIM,
          err,
          null
        )
      );
  }
};

export default {
  CreateDataIRS,
  UpdateDataIRS,
  GetIRSByNIMSemester,
  GetIRSAllByNIM,
  CreateIRSScanIRS,
  approveIRS,
  GetIRSAllByNIMNotVerified,
};
