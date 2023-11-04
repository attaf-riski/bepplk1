import { Optional, DataTypes, Model } from "sequelize";
import connection from "../../config/dbConnect";
import User from "./User";

interface MahasiswaAttributes {
  NIM?: string | null;
  nama?: string | null;
  angkatan?: number | null;
  status?: string | null;
  photo?: string | null;
  userId?: number | null;
  dosenWaliId?: number | null;

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
  public angkatan!: number | null;
  public status!: string | null;
  public photo!: string | null;
  public userId!: number | null;
  public dosenWaliId!: number | null;
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
    angkatan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
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
    dosenWaliId: {
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
