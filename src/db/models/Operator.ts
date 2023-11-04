import { Optional, DataTypes, Model } from "sequelize";
import connection from "../../config/dbConnect";
import User from "./User";

interface OperatorAttributes {
  idOperator?: number;
  NIP?: string | null;
  nama?: string | null;
  userId?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface OperatorInput
  extends Optional<OperatorAttributes, "idOperator"> {}
export interface OperatorOutput extends Required<OperatorAttributes> {}

class Operator
  extends Model<OperatorAttributes, OperatorInput>
  implements OperatorAttributes
{
  public idOperator?: number;
  public NIP?: string | null;
  public nama?: string | null;
  public userId?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Operator.init(
  {
    idOperator: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    NIP: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
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
