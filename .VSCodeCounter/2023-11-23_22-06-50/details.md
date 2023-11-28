# Details

Date : 2023-11-23 22:06:50

Directory /Users/attaf-riski/Desktop/pujiyanto/nodejs-api

Total : 47 files,  8475 codes, 193 comments, 580 blanks, all 9248 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [README.md](/README.md) | Markdown | 16 | 0 | 1 | 17 |
| [package-lock.json](/package-lock.json) | JSON | 3,152 | 0 | 1 | 3,153 |
| [package.json](/package.json) | JSON | 44 | 0 | 1 | 45 |
| [src/Routes/Routes.ts](/src/Routes/Routes.ts) | TypeScript | 346 | 50 | 54 | 450 |
| [src/config/database.js](/src/config/database.js) | JavaScript | 25 | 0 | 3 | 28 |
| [src/config/dbConnect.ts](/src/config/dbConnect.ts) | TypeScript | 13 | 0 | 6 | 19 |
| [src/controllers/DepartemenController.ts](/src/controllers/DepartemenController.ts) | TypeScript | 202 | 3 | 28 | 233 |
| [src/controllers/DoswalController.ts](/src/controllers/DoswalController.ts) | TypeScript | 218 | 3 | 28 | 249 |
| [src/controllers/IRSController.ts](/src/controllers/IRSController.ts) | TypeScript | 452 | 0 | 38 | 490 |
| [src/controllers/KHSController.ts](/src/controllers/KHSController.ts) | TypeScript | 455 | 0 | 37 | 492 |
| [src/controllers/MahasiswaController.ts](/src/controllers/MahasiswaController.ts) | TypeScript | 637 | 4 | 57 | 698 |
| [src/controllers/OperatorController.ts](/src/controllers/OperatorController.ts) | TypeScript | 188 | 6 | 17 | 211 |
| [src/controllers/PKLController.ts](/src/controllers/PKLController.ts) | TypeScript | 418 | 2 | 46 | 466 |
| [src/controllers/RoleController.ts](/src/controllers/RoleController.ts) | TypeScript | 155 | 0 | 15 | 170 |
| [src/controllers/SkripsiController.ts](/src/controllers/SkripsiController.ts) | TypeScript | 380 | 2 | 43 | 425 |
| [src/controllers/UserController.ts](/src/controllers/UserController.ts) | TypeScript | 168 | 0 | 27 | 195 |
| [src/db/migrations/20231031034955-create-role.js](/src/db/migrations/20231031034955-create-role.js) | JavaScript | 30 | 1 | 1 | 32 |
| [src/db/migrations/20231031082223-create-user.js](/src/db/migrations/20231031082223-create-user.js) | JavaScript | 45 | 1 | 0 | 46 |
| [src/db/migrations/20231102124314-create-mahasiswa.js](/src/db/migrations/20231102124314-create-mahasiswa.js) | JavaScript | 58 | 1 | 1 | 60 |
| [src/db/migrations/20231102130223-create-operator.js](/src/db/migrations/20231102130223-create-operator.js) | JavaScript | 31 | 1 | 1 | 33 |
| [src/db/migrations/20231104080826-create-dosenwali.js](/src/db/migrations/20231104080826-create-dosenwali.js) | JavaScript | 33 | 1 | 2 | 36 |
| [src/db/migrations/20231104081205-create-irs.js](/src/db/migrations/20231104081205-create-irs.js) | JavaScript | 38 | 1 | 1 | 40 |
| [src/db/migrations/20231104081406-create-khs.js](/src/db/migrations/20231104081406-create-khs.js) | JavaScript | 47 | 1 | 1 | 49 |
| [src/db/migrations/20231104081630-create-pkl.js](/src/db/migrations/20231104081630-create-pkl.js) | JavaScript | 42 | 1 | 1 | 44 |
| [src/db/migrations/20231104081745-create-skripsi.js](/src/db/migrations/20231104081745-create-skripsi.js) | JavaScript | 42 | 1 | 1 | 44 |
| [src/db/migrations/20231104082450-create-departemen.js](/src/db/migrations/20231104082450-create-departemen.js) | JavaScript | 32 | 1 | 1 | 34 |
| [src/db/models/Departemen.ts](/src/db/models/Departemen.ts) | TypeScript | 55 | 0 | 9 | 64 |
| [src/db/models/DosenWali.ts](/src/db/models/DosenWali.ts) | TypeScript | 54 | 0 | 9 | 63 |
| [src/db/models/IRS.ts](/src/db/models/IRS.ts) | TypeScript | 58 | 0 | 9 | 67 |
| [src/db/models/KHS.ts](/src/db/models/KHS.ts) | TypeScript | 76 | 0 | 9 | 85 |
| [src/db/models/Mahasiswa.ts](/src/db/models/Mahasiswa.ts) | TypeScript | 109 | 0 | 8 | 117 |
| [src/db/models/Operator.ts](/src/db/models/Operator.ts) | TypeScript | 54 | 0 | 9 | 63 |
| [src/db/models/PKL.ts](/src/db/models/PKL.ts) | TypeScript | 68 | 0 | 9 | 77 |
| [src/db/models/Role.ts](/src/db/models/Role.ts) | TypeScript | 42 | 0 | 6 | 48 |
| [src/db/models/Skripsi.ts](/src/db/models/Skripsi.ts) | TypeScript | 70 | 0 | 9 | 79 |
| [src/db/models/User.ts](/src/db/models/User.ts) | TypeScript | 76 | 0 | 8 | 84 |
| [src/db/seeders/20231031041736-RoleSeeder.js](/src/db/seeders/20231031041736-RoleSeeder.js) | JavaScript | 32 | 16 | 3 | 51 |
| [src/helpers/Helper.ts](/src/helpers/Helper.ts) | TypeScript | 85 | 0 | 15 | 100 |
| [src/helpers/PasswordHelper.ts](/src/helpers/PasswordHelper.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [src/index.ts](/src/index.ts) | TypeScript | 30 | 3 | 6 | 39 |
| [src/middleware/Authorization.ts](/src/middleware/Authorization.ts) | TypeScript | 203 | 1 | 16 | 220 |
| [src/middleware/UploudCSV.ts](/src/middleware/UploudCSV.ts) | TypeScript | 31 | 1 | 5 | 37 |
| [src/middleware/UploudIRS.ts](/src/middleware/UploudIRS.ts) | TypeScript | 28 | 1 | 5 | 34 |
| [src/middleware/UploudImage.ts](/src/middleware/UploudImage.ts) | TypeScript | 32 | 1 | 5 | 38 |
| [src/middleware/UploudPDF.ts](/src/middleware/UploudPDF.ts) | TypeScript | 28 | 1 | 5 | 34 |
| [src/middleware/validation/UserValidation.ts](/src/middleware/validation/UserValidation.ts) | TypeScript | 52 | 0 | 10 | 62 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 12 | 89 | 9 | 110 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)