import { Optional, DataTypes, Model } from "sequelize";
import connection from "../../config/dbConnect";
import User from "./User";

interface MahasiswaAttributes {
  NIM?: string | null;
  nama?: string | null;
  alamat?: string | null;
  kabkota?: string | null;
  provinsi?: string | null;
  angkatan?: number | null;
  jalurMasuk?: string | null;
  email?: string | null;
  noHP?: string | null;
  dosenWaliNIP?: string | null;
  status?: string | null;
  photo?: string | null;
  userId?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface MahasiswaInput extends Optional<MahasiswaAttributes, "NIM"> {}
export interface MahasiswaOutput extends Required<MahasiswaAttributes> {}

class Mahasiswa
  extends Model<MahasiswaAttributes, MahasiswaInput>
  implements MahasiswaAttributes
{
  public NIM!: string | null;
  public nama!: string | null;
  public alamat!: string | null;
  public kabkota!: string | null;
  public provinsi!: string | null;
  public angkatan!: number | null;
  public jalurMasuk!: string | null;
  public email!: string | null;
  public noHP!: string | null;
  public dosenWaliNIP!: string | null;
  public status!: string | null;
  public photo!: string | null;
  public userId!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Mahasiswa.init(
  {
    NIM: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kabkota: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provinsi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    angkatan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jalurMasuk: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    noHP: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dosenWaliNIP: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize: connection,
    underscored: false,
  }
);

Mahasiswa.belongsTo(User, {
  foreignKey: "userId",
});

export default Mahasiswa;
