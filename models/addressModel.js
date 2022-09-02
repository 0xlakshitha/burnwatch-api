export default (sequelize, DataTypes) => {
    const Address = sequelize.define('BurnAddress', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },

        ercHistory: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        bepHistory: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    })

    return Address
}