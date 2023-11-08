import { Optional, DataTypes, Model } from "sequelize";
import connection from "../../config/dbConnect";
import User from "./User";

interface DosenWaliAttributes {
  NIP?: string | null;
  nama?: string | null;
  email?: string | null;
  userId?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface DosenWaliInput extends Optional<DosenWaliAttributes, "NIP"> {}
export interface DosenWaliOutput extends Required<DosenWaliAttributes> {}

class DosenWali
  extends Model<DosenWaliAttributes, DosenWaliInput>
  implements DosenWaliAttributes
{
  public NIP!: string | null;
  public nama!: string | null;
  public email!: string | null;
  public userId!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DosenWali.init(
  {
    NIP: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
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

DosenWali.belongsTo(User, {
  foreignKey: "userId",
});

export default DosenWali;
