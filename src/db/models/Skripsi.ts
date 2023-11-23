import { Optional, DataTypes, Model } from "sequelize";
import connection from "../../config/dbConnect";
import Mahasiswa from "./Mahasiswa";

interface SkripsiAttributes {
  NIM?: string | null;
  status?: string | null;
  nilai?: string | null;
  tanggalSidang?: Date | null;
  lamaStudi?: number | null;
  scanBeritaAcara?: string | null;
  verified?: boolean | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface SkripsiInput extends Optional<SkripsiAttributes, "NIM"> {}
export interface SkripsiOutput extends Required<SkripsiAttributes> {}

class Skripsi
  extends Model<SkripsiAttributes, SkripsiInput>
  implements SkripsiAttributes
{
  public NIM!: string;
  public status!: string;
  public nilai!: string;
  public tanggalSidang!: Date;
  public lamaStudi!: number;
  public scanBeritaAcara!: string;
  public verified!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Skripsi.init(
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggalSidang: {
      type: DataTypes.DATE,
    },
    lamaStudi: {
      type: DataTypes.INTEGER,
    },
    scanBeritaAcara: {
      type: DataTypes.STRING,
      allowNull: false,
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

Skripsi.belongsTo(Mahasiswa, {
  foreignKey: "NIM",
});

export default Skripsi;
