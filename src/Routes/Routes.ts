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
import DoswalController from "../controllers/DoswalController";
import DepartemenController from "../controllers/DepartemenController";

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

router.post(
  "/mahasiswa/create",
  Authorization.Authenticated,
  Authorization.Operator,
  MahasiswaController.CreateMahasiswa
);

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
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
  IRSController.UpdateDataIRS
);

router.post(
  "/irs/scan/:NIM&:semesterAktif",
  Authorization.Authenticated,
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
  IRSController.CreateIRSScanIRS
);

router.get(
  "/irs/detail/:NIM&:semesterAktif",
  Authorization.Authenticated,
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
  IRSController.GetIRSByNIMSemester
);

router.get(
  "/irs/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  // Authorization.MahasiswaDataLengkap,
  IRSController.GetIRSAllByNIM
);

// khs
router.post(
  "/khs/:NIM",
  Authorization.Authenticated,
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
  KHSController.CreateDataKHS
);

router.post(
  "/khs/update/:NIM&:semesterAktif",
  Authorization.Authenticated,
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
  KHSController.UpdateDataKHS
);

router.post(
  "/khs/scan/:NIM&:semesterAktif",
  Authorization.Authenticated,
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
  KHSController.CreateKHSScanKHS
);

router.get(
  "/khs/detail/:NIM&:semesterAktif",
  Authorization.Authenticated,
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
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
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
  PKLController.CreatePKLScanBeritaAcara
);

router.get(
  "/pkl/:NIM",
  Authorization.Authenticated,
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
  PKLController.GetPKLByNIM
);

// skripsi
router.post(
  "/skripsi/:NIM",
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
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
  SkripsiController.CreateSkripsiScanBeritaAcara
);

router.get(
  "/skripsi/:NIM",
  Authorization.Authenticated,
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
  SkripsiController.GetSkripsiByNIM
);

// verifikasi dosen wali thd data mahasiswa wali
// get semya pkl yangbelum diverifikasi dosenwali
// get semua skripsi yang belum diverifikasi dosen wali
router.get(
  "/doswal/listdoswal",
  Authorization.Authenticated,
  Authorization.Operator,
  DoswalController.GetAllDoswal
);

router.get(
  "/doswal/:userid",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  DoswalController.GetDosenWaliByUserId
);

// get mahasiswa yang memiliki irs belum diverifikasi dosen wali
router.get(
  "/doswal/irs/:NIP",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  MahasiswaController.GetMahasiswaWithNotVerifiedIRSByBIP
);

// get semua IRS yang belum diverifikasi dosen wali
router.get(
  "/doswal/listirs/:NIM",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  IRSController.GetIRSAllByNIMNotVerified
);

router.post(
  "/irs/approve/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  IRSController.approveIRS
);

router.post(
  "/irs/approve/update/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  IRSController.UpdateDataIRS
);

// get semua KHS yang belum diverifikasi dosen wali
router.get(
  "/doswal/khs/:NIP",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  MahasiswaController.GetMahasiswaWithNotVerifiedKHSByBIP
);

router.get(
  "/doswal/listkhs/:NIM",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  KHSController.GetKHSAllByNIMNotVerified
);

router.post(
  "/khs/approve/update/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  KHSController.UpdateDataKHS
);

router.post(
  "/khs/approve/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  KHSController.approveKHS
);

router.post(
  "/khs/approve/update/:NIM&:semesterAktif",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  KHSController.UpdateDataKHS
);

// skripsi
router.post(
  "/skripsi/approve/:NIM",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  SkripsiController.approveSkripsi
);

router.post(
  "/skripsi/approve/update/:NIM",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  SkripsiController.UpdateDataSkripsi
);

router.get(
  "/doswal/skripsi/:NIP",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  MahasiswaController.GetMahasiswaWithNotVerifiedSkripsiByBIP
);

// pkl
router.post(
  "/pkl/approve/:NIM",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  PKLController.approvePKL
);

router.post(
  "/pkl/approve/update/:NIM",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  PKLController.UpdateDataPKL
);

router.get(
  "/doswal/pkl/:NIP",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  MahasiswaController.GetMahasiswaWithNotVerifiedPKLByBIP
);

router.get(
  "/pencarianmahasiswa/:keyword&:doswalNIP", //keyword nama atau nim
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  MahasiswaController.GetMahasiswaByKeywordAndDoswalNIP
);

router.get(
  "/pencarianmahasiswa/detailmahasiswa/:NIM",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  Authorization.DosenWaliNIPonMahasiswa,
  MahasiswaController.GetMahasiswaByNIM
);

// kembalikan warna semester 1 - 14
router.get(
  "/dashboarddoswal/colorbox/:NIM",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  MahasiswaController.GetColorBox
);

// doswal dashboard
router.get(
  "/dashboarddoswal/:NIP",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  DoswalController.GetDashboardDoswal
);

// operator dashboard
router.get(
  "/operator/:userid",
  Authorization.Authenticated,
  Authorization.Operator,
  OperatorController.GetOperatorByUserId
);

// departemen dashboard
router.get(
  "/dashboarddepartemen/:NIP",
  Authorization.Authenticated,
  Authorization.Departemen,
  DepartemenController.GetDashboardDepartemen
);

router.get(
  "/departemen/:userid",
  Authorization.Authenticated,
  Authorization.Departemen,
  DepartemenController.GetDepartemenByUserId
);

export default router;
