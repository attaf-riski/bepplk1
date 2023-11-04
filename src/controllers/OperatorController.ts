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
let generateFileName: any = "";
const UploudCSV = async (req: Request, res: Response): Promise<Response> => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a csv file!" });
    }

    const namaPath = "uploud/" + req.file.filename;
    const hashed = await PasswordHelper.PasswrodHashing("12345678");
    fs.createReadStream(namaPath)
      .on("error", (err) => {
        console.log(err);
      })

      .pipe(csvv(["NIM", "Nama", "Angkatan", "IdDosenWali"]))
      .on("data", (data: any) => {
        const namaTrim: string = data.Nama.replace(/\s/g, "");
        if (data.NIM.length > 0) {
          csvData.push({
            NIM: data.NIM,
            nama: data.Nama,
            angkatan: data.Angkatan,
            status: "Aktif",
            photo:
              "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Transparent-Image.png",
            dosenWaliId: data.IdDosenWali,
            name: data.Nama,
            email: namaTrim + "@students.undip.ac.id",
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
            console.log("Sudah ada " + mhs.NIM);
            dataKembar.push(csvDataBuffer[i]);
            User.destroy({
              where: {
                id: csvDataBuffer[i].userId,
              },
            });
          } else {
            console.log("Belum ada ");
            csvBerhasilAkanDikirim.push(csvDataBuffer[i]);
            await Mahasiswa.create(csvDataBuffer[i]);
          }
        }

        if (csvBerhasilAkanDikirim.length > 0) {
          const newCsvData = csvBerhasilAkanDikirim.map((item: any) => {
            return {
              NIM: item.NIM,
              name: item.name,
              email: item.email,
              password: "12345678",
            };
          });
          //jadikan csvData menjadi file csv yang baru
          const json2csvParser = new json2csv.Parser();
          const csv = json2csvParser.parse(newCsvData);
          generateFileName = "uploud/generate-" + Date.now() + ".csv";
          fs.writeFile(generateFileName, csv, (err) => {
            if (err) throw err;
          });
          fs.unlinkSync(namaPath);
        }
      });
    if (dataKembar.length > 0) {
      const buffer = {
        ...dataKembar,
        link: path.join("http://localhost/" + generateFileName),
      };
      dataKembar = [];
      return res
        .status(200)
        .send(
          Helper.ResponseData(
            200,
            "Terdapat data Mahasiswa yang sudah ada, data mahasiswa selain data yang sudah ada berhasil di tambahkan",
            null,
            buffer
          )
        );
    }

    console.log("generated " + generateFileName);
    if (generateFileName.length > 0) {
      const linkDownload = {
        link: path.join("http://localhost:5502/" + generateFileName),
      };
      return res
        .status(200)
        .send(
          Helper.ResponseData(
            200,
            "Berhasil menambahkan data mahasiswa dari csv dan mendownload csv akses akun",
            null,
            linkDownload
          )
        );
    } else {
      return res
        .status(200)
        .send(
          Helper.ResponseData(
            200,
            "Berhasil menambahkan data mahasiswa tapi belum bisa generate csv akses akun",
            null,
            null
          )
        );
    }
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
  const file = path.join("uploud/" + filename);
  res.contentType("text/csv");
  res.sendFile(file);
  fs.unlinkSync(file);
  return res
    .status(200)
    .send(
      Helper.ResponseData(200, "Berhasil mendownload file csv", null, null)
    );
};

export default { UploudCSV, DownloadCSV };
