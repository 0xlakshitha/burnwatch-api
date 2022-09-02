export default (sequelize, DataTypes) => {
    const TokenSymbol = sequelize.define('TokenSymbol', {
        symbol: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { timestamps: false })

    return TokenSymbol
}