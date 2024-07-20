module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
      roomId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
    });
  
    return Session;
};

  