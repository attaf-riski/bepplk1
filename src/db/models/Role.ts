import { Optional, DataTypes, Model } from "sequelize";
import connection from "../../config/dbConnect";

interface RoleAttributes {
  id?: number;
  rolName?: string | null;
  active?: boolean | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleInput extends Optional<RoleAttributes, "id"> {}
export interface RoleOutput extends Required<RoleAttributes> {}

class Role extends Model<RoleAttributes, RoleInput> implements RoleAttributes {
  public id!: number;
  public rolName!: string | null;
  public active!: boolean | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    rolName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    active: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: true,
    sequelize: connection,
    underscored: false,
  }
);

export default Role;
