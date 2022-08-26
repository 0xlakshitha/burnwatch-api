export default (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },

        isSynced: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        startBlock: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        endBlock: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        lastTimeStamp: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    })

    return Address
}