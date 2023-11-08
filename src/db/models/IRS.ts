import { Optional, DataTypes, Model } from "sequelize";
import connection from "../../config/dbConnect";
import Mahasiswa from "./Mahasiswa";

interface IRSAttributes {
  semesterAktif?: number | null;
  jumlahSks?: number | null;
  scanIRS?: string | null;
  NIM?: string | null;
  verified?: boolean | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRSInput extends Optional<IRSAttributes, "NIM"> {}
export interface IRSOutput extends Required<IRSAttributes> {}

class IRS extends Model<IRSAttributes, IRSInput> implements IRSAttributes {
  public semesterAktif!: number;
  public jumlahSks!: number;
  public scanIRS!: string;
  public NIM!: string;
  public verified!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

IRS.init(
  {
    semesterAktif: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    jumlahSks: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    scanIRS: {
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

IRS.belongsTo(Mahasiswa, {
  foreignKey: "NIM",
});

export default IRS;
