import { Request, Response } from "express";
import Helper from "../helpers/Helper";
import uploadFile from "../middleware/UploudCSV";
import path from "path";
import fs from "fs";
import PasswordHelper from "../helpers/PasswordHelper";
import csvv from "csv-parser";
import User from "../db/models/User";
import Mahasiswa from "../db/models/Mahasiswa";
import json2csv from "json2csv";

let dataKembar: any = [];
let csvData: any = [];

const UploudCSV = async (req: Request, res: Response): Promise<Response> => {
  let generateFileName = "generate-" + Date.now() + ".csv";
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a csv file!" });
    }

    const namaPath = req.file.path;
    const hashed = await PasswordHelper.PasswrodHashing("12345678");
    fs.createReadStream(namaPath)
      .on("error", (err) => {
        console.log(err);
      })

      .pipe(csvv(["NIM", "Nama", "Angkatan", "NIPDosenWali"]))
      .on("data", (data: any) => {
        const random = Math.floor(1000 + Math.random() * 9000);
        const namaTrim: string = data.Nama.replace(/\s/g, "");
        if (data.NIM.length > 0) {
          csvData.push({
            NIM: data.NIM,
            nama: data.Nama,
            alamat: "",
            kabkota: "",
            provinsi: "",
            angkatan: data.Angkatan,
            jalurMasuk: "",
            email: "",
            noHp: "",
            status: "Aktif",
            photo:
              "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Transparent-Image.png",
            dosenWaliNIP: data.NIPDosenWali,
            username: "MA" + namaTrim + random,
            roleId: 5,
            password: hashed,
            verified: true,
            active: true,
            userId: null,
          });
        }
      })

      .on("end", async () => {
        const csvBerhasilAkanDikirim = [];
        const csvDataBuffer = csvData;
        csvData = [];
        csvDataBuffer.shift();
        console.log(csvDataBuffer);
        // buat user accout
        const user = await User.bulkCreate(csvDataBuffer);
        if (user) {
          for (let i = 0; i < user.length; i++) {
            csvDataBuffer[i].userId = user[i].dataValues.id;
          }
        }
        // masukkan ke basis data dan sambungkan dengan user dan dosen wali
        for (let i = 0; i < csvDataBuffer.length; i++) {
          const mhs = await Mahasiswa.findOne({
            where: {
              NIM: csvDataBuffer[i].NIM,
            },
          });
          if (mhs) {
            dataKembar.push(csvDataBuffer[i]);
            User.destroy({
              where: {
                id: csvDataBuffer[i].userId,
              },
            });
          } else {
            csvBerhasilAkanDikirim.push(csvDataBuffer[i]);
            await Mahasiswa.create(csvDataBuffer[i]);
          }
        }
        if (csvBerhasilAkanDikirim.length > 0) {
          // ada csv yang harus digenerate, walaupun engga semua
          const newCsvData = csvBerhasilAkanDikirim.map((item: any) => {
            return {
              NIM: item.NIM,
              nama: item.nama,
              username: item.username,
              password: "12345678",
            };
          });
          //jadikan csvData menjadi file csv yang baru
          const json2csvParser = new json2csv.Parser();
          const csv = json2csvParser.parse(newCsvData);
          fs.writeFile("uploud/" + generateFileName, csv, (err) => {
            if (err) throw err;
          });
        } else {
          // tidak ada csv yang harus digenerate
        }
        fs.unlinkSync(namaPath);
      });

    const respon = {
      link: generateFileName,
    };
    return res
      .status(200)
      .send(Helper.ResponseData(200, "Sukses", null, respon));
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Could not upload the file: " + req.file?.originalname,
          err,
          null
        )
      );
  }
};

const DownloadCSV = async (req: Request, res: Response): Promise<Response> => {
  const { filename } = req.params;
  const fileLocation = path.join("uploud/" + filename);
  const fileExist = fs.existsSync(fileLocation);
  if (!fileExist) {
    return res
      .status(404)
      .send(Helper.ResponseData(404, "File tidak ditemukan", null, null));
  }

  // kirimkan file di folder uploud sesuai nama filename ke user dalam bentuk file csv
  console.log(fileLocation);
  const file = fs.createReadStream(fileLocation);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=" + filename);
  file.pipe(res);
  return res.status(200);
};

const DeleteCSV = async (req: Request, res: Response) => {
  const { filename } = req.params;
  const fileLocation = path.join("uploud/" + filename);
  const fileExist = fs.existsSync(fileLocation);
  if (fileExist) {
    fs.unlinkSync(fileLocation);
    return;
  }
  return;
};

export default { UploudCSV, DownloadCSV, DeleteCSV };
