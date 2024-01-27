import {
  Table,
  Model,
  Column,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
} from "sequelize-typescript";
import { Optional } from "sequelize";

interface DocBoxAttributes {
  id: string; // Alphanumeric ID
  name: string;
  description?: string;
  created_at?: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;
  files?: JSON[];
}

interface DocBoxCreationAttributes extends Optional<DocBoxAttributes, "id"> {}

@Table({
  timestamps: true,
  paranoid: true,
})
export default class DocBox extends Model<
  DocBoxAttributes,
  DocBoxCreationAttributes
> {
  @PrimaryKey
  @Column
  id!: string;

  @Column
  name!: string;

  @Column
  description?: string;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;

  @DeletedAt
  deleted_at?: Date;

  @Column
  created_by?: string;

  @Column
  updated_by?: string;

  @Column
  deleted_by?: string;
}
