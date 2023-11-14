import express from "express";
import RoleController from "../controllers/RoleController";
import UserController from "../controllers/UserController";
import UserValidation from "../middleware/validation/UserValidation";
import OperatorController from "../controllers/OperatorController";
import Authorization from "../middleware/Authorization";
import MahasiswaController from "../controllers/MahasiswaController";
import IRSController from "../controllers/IRSController";
import KHSController from "../controllers/KHSController";
import PKL from "../db/models/PKL";
import PKLController from "../controllers/PKLController";
import SkripsiController from "../controllers/SkripsiController";

const router = express.Router();

router.get(
  "/role",
  Authorization.Authenticated,
  Authorization.SuperAdmin,
  RoleController.GetRole
);
router.post(
  "/role",
  Authorization.Authenticated,
  Authorization.SuperAdmin,
  RoleController.CreateRole
);
router.put(
  "/role/:id",
  Authorization.Authenticated,
  Authorization.SuperAdmin,
  RoleController.UpdateRole
);
router.delete(
  "/role/:id",
  Authorization.Authenticated,
  Authorization.SuperAdmin,
  RoleController.DeleteRole
);
router.get("/role/:id", RoleController.GetRoleById);

// user routing
router.post(
  "/user/signup",
  UserValidation.RegisterValidation,
  UserController.Register
);

router.post("/user/login", UserController.UserLogin);
router.get("/user/refresh-token", UserController.RefreshToken);
router.get(
  "/user/detail",
  Authorization.Authenticated,
  UserController.UserDetail
);
router.get(
  "/user/logout",
  Authorization.Authenticated,
  UserController.UserLogout
);

// operator
router.post(
  "/csv/uploud",
  Authorization.Authenticated,
  Authorization.Operator,
  OperatorController.UploudCSV
);

// file uploud download
router.get("/uploud/:filename", OperatorController.DownloadCSV);
router.delete("/uploud/:filename", OperatorController.DeleteCSV);

// mahasiswa
// router.get(
//   "/mahasiswa/:NIM",
//   Authorization.Authenticated,
//   Authorization.MahasiswaAutho,
//   Authorization.MahasiswaNIM,
//   MahasiswaController.GetMahasiswaByNIM
// );

router.get(
  "/mahasiswa/:userid",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  MahasiswaController.GetMahasiswaByUserId
);

router.post(
  "/mahasiswa/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  MahasiswaController.UpdateData
);

router.post(
  "/mahasiswa/image/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  MahasiswaController.UpdataDataPhoto
);

// irs
router.post(
  "/irs/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  IRSController.CreateDataIRS
);

router.post(
  "/irs/update/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  IRSController.UpdateDataIRS
);

router.post(
  "/irs/scan/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  IRSController.CreateIRSScanIRS
);

router.get(
  "/irs/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  IRSController.GetIRSByNIMSemester
);

router.get(
  "/irs/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  Authorization.MahasiswaDataLengkap,
  KHSController.GetKHSAllByNIM
);

// khs
router.post(
  "/khs/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  KHSController.CreateDataKHS
);

router.post(
  "/khs/update/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  KHSController.UpdateDataKHS
);

router.post(
  "/khs/scan/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  KHSController.CreateKHSScanKHS
);

router.get(
  "/khs/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  KHSController.GetKHSByNIMSemester
);

router.get(
  "/khs/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  KHSController.GetKHSAllByNIM
);

router.get(
  "/khs/pdf/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM
);

// PKL
router.post(
  "/pkl/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  PKLController.CreateDataPKL
);

router.post(
  "/pkl/update/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  PKLController.UpdateDataPKL
);

router.post(
  "/pkl/scan/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  PKLController.CreatePKLScanBeritaAcara
);

router.get(
  "/pkl/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  PKLController.GetPKLByNIM
);

// skripsi
router.post(
  "/skrips/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  SkripsiController.CreateDataSkripsi
);

router.post(
  "/skripsi/update/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  SkripsiController.UpdateDataSkripsi
);

router.post(
  "/skripsi/scan/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  SkripsiController.CreateSkripsiScanBeritaAcara
);

router.get(
  "/skripsi/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  SkripsiController.GetSkripsiByNIM
);

// verifikasi dosen wali thd data mahasiswa wali
// get semua IRS yang belum diverifikasi dosen wali
// get semua KHS yang belum diverifikasi dosen wali
// get semya pkl yangbelum diverifikasi dosenwali
// get semua skripsi yang belum diverifikasi dosen wali

export default router;
