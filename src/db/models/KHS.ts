import { Optional, DataTypes, Model } from "sequelize";
import connection from "../../config/dbConnect";
import Mahasiswa from "./Mahasiswa";

interface KHSAttributes {
  semesterAktif?: number | null;
  jumlahSksSemester?: number | null;
  jumlahSksKumulatif?: number | null;
  IPS?: number | null;
  IPK?: number | null;
  scanKHS?: string | null;
  NIM?: string | null;
  verified?: boolean | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface KHSInput extends Optional<KHSAttributes, "NIM"> {}
export interface KHSOutput extends Required<KHSAttributes> {}

class KHS extends Model<KHSAttributes, KHSInput> implements KHSAttributes {
  public semesterAktif!: number;
  public jumlahSksSemester!: number;
  public jumlahSksKumulatif!: number;
  public IPS!: number;
  public IPK!: number;
  public scanKHS!: string;
  public NIM!: string;
  public verified!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

KHS.init(
  {
    semesterAktif: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    jumlahSksSemester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jumlahSksKumulatif: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IPS: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    IPK: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    scanKHS: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    NIM: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: connection,
    underscored: false,
  }
);

KHS.belongsTo(Mahasiswa, {
  foreignKey: "NIM",
});

export default KHS;
