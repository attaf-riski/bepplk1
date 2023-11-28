import { Optional, DataTypes, Model } from "sequelize";
import connection from "../../config/dbConnect";
import User from "./User";

interface DepartemenAttributes {
  NIP?: string | null;
  nama?: string | null;
  email?: string | null;
  userId?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface DepartemenInput
  extends Optional<DepartemenAttributes, "NIP"> {}
export interface DepartemenOutput extends Required<DepartemenAttributes> {}

class Departemen
  extends Model<DepartemenAttributes, DepartemenInput>
  implements DepartemenAttributes
{
  public NIP?: string | null;
  public nama?: string | null;
  public email?: string | null;
  public userId?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Departemen.init(
  {
    NIP: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
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

Departemen.belongsTo(User, {
  foreignKey: "userId",
});

export default Departemen;
