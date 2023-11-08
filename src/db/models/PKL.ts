import { Optional, DataTypes, Model } from "sequelize";
import connection from "../../config/dbConnect";
import Mahasiswa from "./Mahasiswa";

interface PKLAttributes {
  NIM?: string | null;
  status?: string | null;
  nilai?: number | null;
  scanBeritaAcara?: string | null;
  verified?: boolean | null;
  tanggalSidang?: Date | null;
  semesterLulus?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface PKLInput extends Optional<PKLAttributes, "NIM"> {}
export interface PKLOutput extends Required<PKLAttributes> {}

class PKL extends Model<PKLAttributes, PKLInput> implements PKLAttributes {
  public NIM!: string;
  public status!: string;
  public nilai!: number;
  public scanBeritaAcara!: string;
  public verified!: boolean;
  public tanggalSidang!: Date;
  public semesterLulus!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PKL.init(
  {
    NIM: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nilai: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    scanBeritaAcara: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tanggalSidang: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    semesterLulus: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
    sequelize: connection,
    underscored: false,
  }
);

PKL.belongsTo(Mahasiswa, {
  foreignKey: "NIM",
});

export default PKL;
