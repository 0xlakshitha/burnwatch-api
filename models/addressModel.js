export default (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },

        ercHIstory: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        bscHIstory: {
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