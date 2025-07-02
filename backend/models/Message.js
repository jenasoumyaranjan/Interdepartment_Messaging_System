module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.STRING, // text, task, notice
      defaultValue: 'text'
    },
    department: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.STRING, // Normal, High, Critical
      defaultValue: 'Normal'
    }
  });
  Message.associate = (models) => {
    Message.belongsTo(models.User, { as: 'Sender', foreignKey: 'senderId' });
    Message.belongsTo(models.User, { as: 'Receiver', foreignKey: 'receiverId' });
  };
  return Message;
};
