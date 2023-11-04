import express from "express";
import RoleController from "../controllers/RoleController";
import UserController from "../controllers/UserController";
import UserValidation from "../middleware/validation/UserValidation";
import OperatorController from "../controllers/OperatorController";
import Authorization from "../middleware/Authorization";
import MahasiswaController from "../controllers/MahasiswaController";

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

router.get("/uploud/:filename", OperatorController.DownloadCSV);

// mahasiswa
router.get(
  "/mahasiswa/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  MahasiswaController.GetMahasiswaByNIM
);
router.post(
  "/mahasiswa/:NIM",
  Authorization.Authenticated,
  Authorization.MahasiswaAutho,
  Authorization.MahasiswaNIM,
  MahasiswaController.UpdateData
);

export default router;
