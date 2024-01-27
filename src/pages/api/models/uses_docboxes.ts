import {
  Table,
  Model,
  Column,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
  AutoIncrement,
} from "sequelize-typescript";
import { Optional } from "sequelize";

interface UserDocBoxAttributes {
  id: number;
  user_id: string;
  docbox_id?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

interface UserDocBoxCreationAttributes
  extends Optional<UserDocBoxAttributes, "id"> {}

@Table({
  timestamps: true,
  paranoid: true,
})
export default class UsersDocBoxes extends Model<
  UserDocBoxAttributes,
  UserDocBoxCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  user_id!: string;

  @Column
  docbox_id!: string;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;

  @DeletedAt
  deleted_at?: Date;
}
