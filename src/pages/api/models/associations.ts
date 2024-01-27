const applyAssociations = (sequelize: any) => {
  const { Files, DocBox, UsersDocBoxes } = sequelize.models;

  Files.belongsTo(DocBox, { foreignKey: "doc_box", as: "files" });
  DocBox.hasMany(Files, { foreignKey: "doc_box", as: "files" });
  DocBox.hasMany(UsersDocBoxes, {
    foreignKey: "docbox_id",
    as: "userDocBoxes",
  });
};

export default applyAssociations;
