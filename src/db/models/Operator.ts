import { Optional, DataTypes, Model } from "sequelize";
import connection from "../../config/dbConnect";
import User from "./User";

interface OperatorAttributes {
  NIP?: string | null;
  nama?: string | null;
  email?: string | null;
  userId?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface OperatorInput extends Optional<OperatorAttributes, "NIP"> {}
export interface OperatorOutput extends Required<OperatorAttributes> {}

class Operator
  extends Model<OperatorAttributes, OperatorInput>
  implements OperatorAttributes
{
  public NIP?: string | null;
  public nama?: string | null;
  public email?: string | null;
  public userId?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Operator.init(
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

Operator.belongsTo(User, {
  foreignKey: "userId",
});

export default Operator;
