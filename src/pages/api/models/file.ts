import {
  Table,
  Model,
  Column,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import { Optional } from "sequelize";

interface FilesAttributes {
  id: number;
  name: string;
  description: string;
  file_url: string;
  doc_box: number;
  fencing_end_date: Date;
  fencing_start_date: Date;
  created_at?: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;
}

interface FilesCreationAttributes extends Optional<FilesAttributes, "id"> {}

@Table({
  timestamps: true, // Enable timestamps
  paranoid: true, // Enable soft deletion (adds deletedAt)
})
export default class Files extends Model<
  FilesAttributes,
  FilesCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column
  file_url!: string;

  @Column
  doc_box!: string;

  @Column
  fencing_start_date!: Date;

  @Column
  fencing_end_date!: Date;

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
