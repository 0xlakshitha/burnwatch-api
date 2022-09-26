export default (sequelize, DataTypes) => {
    const BurnSum = sequelize.define('burnsthisyear', {
        token: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },

        BurnsYesterday: {
            type: DataTypes.STRING(100)
        },

        BurnsToday: {
            type: DataTypes.STRING(100)
        },

        BurnsThisWeek: {
            type: DataTypes.STRING(100)
        },

        BurnsThisMonth: {
            type: DataTypes.STRING(100)
        },

        BurnsThisYear: {
            type: DataTypes.STRING(100)
        },
        
    }, {
        timestamps: false,
        freezeTableName: true
    })

    return BurnSum
}