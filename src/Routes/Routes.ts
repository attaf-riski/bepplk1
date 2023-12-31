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
import IRS from "../db/models/IRS";
import KHS from "../db/models/KHS";

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
  "/user/getuserbyid/:id",
  Authorization.Authenticated,
  UserController.GetUserById
);

router.get(
  "/user/logout",
  Authorization.Authenticated,
  UserController.UserLogout
);

router.post(
  "/user/resetpassword",
  Authorization.Authenticated,
  UserController.ResetPassword
);

router.post(
  "/user/updatepassword",
  Authorization.Authenticated,
  UserController.UpdatePassword
);

router.delete(
  "/mahasiswa/delete/:NIM",
  Authorization.Authenticated,
  Authorization.Operator,
  MahasiswaController.DeleteDataMahasiswa
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
  "/operator/listmahasiswa/:keyword",
  Authorization.Authenticated,
  Authorization.Operator,
  MahasiswaController.GetMahasiswaByKeyword
);

router.get(
  "/operator/listmahasiswa/detail/:NIM",
  Authorization.Authenticated,
  Authorization.Operator,
  MahasiswaController.GetMahasiswaByNIM
);

router.get(
  "/operator/listdoswal/:keyword",
  Authorization.Authenticated,
  Authorization.Operator,
  DoswalController.GetDoswalByKeyword
);

router.get(
  "/operator/listdoswal/detail/:NIP",
  Authorization.Authenticated,
  // Authorization.Operator,
  DoswalController.GetDosenWaliByNIP
);

router.get(
  "/operator/listdepartemen/:keyword",
  Authorization.Authenticated,
  Authorization.Operator,
  DepartemenController.GetDepartemenByKeyword
);

router.get(
  "/operator/listdepartemen/detail/:NIP",
  Authorization.Authenticated,
  // Authorization.Operator,
  DepartemenController.GetDepartemenByNIP
);

router.post(
  "/departemen/update/:NIP",
  Authorization.Authenticated,
  // Authorization.Operator,
  DepartemenController.UpdateData
);

router.delete(
  "/departemen/delete/:NIP",
  Authorization.Authenticated,
  Authorization.Operator,
  DepartemenController.DeleteDepartemen
);

router.post(
  "/doswal/create",
  Authorization.Authenticated,
  Authorization.Operator,
  DoswalController.CreateDoswal
);

router.post(
  "/doswal/update/:NIP",
  Authorization.Authenticated,
  DoswalController.UpdateData
);

router.delete(
  "/doswal/delete/:NIP",
  Authorization.Authenticated,
  Authorization.Operator,
  DoswalController.DeleteDoswal
);

router.get(
  "/mahasiswa/:userid",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  MahasiswaController.GetMahasiswaByUserId
);

router.get(
  "/dashboardmahasiswa/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  MahasiswaController.GetDashboardMahasiswa
);

router.post(
  "/mahasiswa/:NIM",
  Authorization.Authenticated,
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
  MahasiswaController.UpdateData
);

router.post(
  "/mahasiswa/image/:NIM",
  Authorization.Authenticated,
  // Authorization.MahasiswaAutho,
  // Authorization.MahasiswaNIM,
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

router.delete(
  "/irs/delete/:NIM&:semesterAktif",
  Authorization.Authenticated,
  IRSController.DeleteIRSByNIMSemester
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

router.delete(
  "/khs/delete/:NIM&:semesterAktif",
  Authorization.Authenticated,
  KHSController.DeleteKHSByNIMSemester
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

router.delete(
  "/pkl/delete/:NIM",
  Authorization.Authenticated,
  PKLController.DeletePKLByNIM
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

router.delete(
  "/skripsi/delete/:NIM",
  Authorization.Authenticated,
  SkripsiController.DeleteSkripsiByNIM
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
  "/doswal/irs/:NIP&:type",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  MahasiswaController.GetMahasiswaWithNotVerifiedIRSByBIP
);

// get semua IRS yang belum diverifikasi dosen wali
router.get(
  "/doswal/listirs/:NIM&:type",
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
  "/doswal/khs/:NIP&:type",
  Authorization.Authenticated,
  Authorization.DosenWaliAutho,
  MahasiswaController.GetMahasiswaWithNotVerifiedKHSByBIP
);

router.get(
  "/doswal/listkhs/:NIM&:type",
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
  "/doswal/skripsi/:NIP&:type",
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
  "/doswal/pkl/:NIP&:type",
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
  "/pencarianmahasiswa/departemen/:keyword", //keyword nama atau nim
  Authorization.Authenticated,
  Authorization.Departemen,
  MahasiswaController.GetMahasiswaByKeyword
);

router.get(
  "/pencarianmahasiswa/detailmahasiswa/:NIM",
  Authorization.Authenticated,
  // Authorization.DosenWaliAutho,
  // Authorization.DosenWaliNIPonMahasiswa,
  MahasiswaController.GetMahasiswaByNIM
);

// kembalikan warna semester 1 - 14
router.get(
  "/dashboarddoswal/colorbox/:NIM",
  Authorization.Authenticated,
  // Authorization.DosenWaliAutho,
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
  "/dashboardoperator",
  Authorization.Authenticated,
  Authorization.Operator,
  OperatorController.GetDashboardOperator
);

router.get(
  "/operator/listoperator/detail/:NIP",
  Authorization.Authenticated,
  Authorization.Operator,
  OperatorController.GetOperatorByNIP
);

router.post(
  "/operator/update/:NIP",
  Authorization.Authenticated,
  OperatorController.UpdateData
);

// departemen dashboard
router.get(
  "/dashboarddepartemen/:NIP",
  Authorization.Authenticated,
  Authorization.Departemen,
  DepartemenController.GetDashboardDepartemen
);

router.post(
  "/departemen/create",
  Authorization.Authenticated,
  Authorization.Operator,
  DepartemenController.CreateDepartemen
);

router.get(
  "/operator/:userid",
  Authorization.Authenticated,
  Authorization.Operator,
  OperatorController.GetOperatorByUserId
);

router.get(
  "/departemen/:userid",
  Authorization.Authenticated,
  Authorization.Departemen,
  DepartemenController.GetDepartemenByUserId
);

router.get(
  "/departemen/getsevenyears/pkl",
  Authorization.Authenticated,
  Authorization.Departemen,
  DepartemenController.GetRekapSevenYearsPKL
);

router.get(
  "/departemen/getsevenyears/pkl/detail/:tahun&:status",
  Authorization.Authenticated,
  Authorization.Departemen,
  DepartemenController.GetDetailRekapSevenYearsPKL
);

router.get(
  "/departemen/getsevenyears/skripsi",
  Authorization.Authenticated,
  Authorization.Departemen,
  DepartemenController.GetRekapSevenYearsSkripsi
);

router.get(
  "/departemen/getsevenyears/skripsi/detail/:tahun&:status",
  Authorization.Authenticated,
  Authorization.Departemen,
  DepartemenController.GetDetailRekapSevenYearsSkripsi
);

router.get(
  "/departemen/getrekapstatus/mahasiswa",
  Authorization.Authenticated,
  Authorization.Departemen,
  DepartemenController.GetRekapStatusMahasiswa
);

router.get(
  "/departemen/getrekapstatus/mahasiswa/detail/:tahun&:status",
  Authorization.Authenticated,
  Authorization.Departemen,
  DepartemenController.GetDetailRekapStatus
);

export default router;
