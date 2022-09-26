export default (sequelize, DataTypes) => {
    const McwCoins = sequelize.define('wp_ej44eh_mcw_coins', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
        },
        symbol: {
            type: DataTypes.STRING(10),
        },
        slug: {
            type: DataTypes.STRING(100),
            unique: true
        },
        img: {
            type: DataTypes.INTEGER(200)
        },
        rank: {
            type: DataTypes.INTEGER,
        },
        price_usd: {
            type: DataTypes.DECIMAL(24, 14)
        },
        price_btc: {
            type: DataTypes.DECIMAL(10, 8)
        },
        volume_usd_24h: {
            type: DataTypes.DECIMAL(22, 2)
        },
        market_cap_usd: {
            type: DataTypes.DECIMAL(22, 2)
        },
        high_24h: {
            type: DataTypes.DECIMAL(20, 10)
        },
        low_24h: {
            type: DataTypes.DECIMAL(20, 10)
        },
        available_supply: {
            type: DataTypes.DECIMAL(22, 2)
        },
        total_supply: {
            type: DataTypes.DECIMAL(22, 2)
        },
        ath: {
            type: DataTypes.DECIMAL(22, 10)
        },
        ath_date: {
            type: DataTypes.INTEGER
        },
        price_change_24h: {
            type: DataTypes.DECIMAL(20, 10)
        },
        percent_change_1h: {
            type: DataTypes.DECIMAL(7, 2)
        },
        percent_change_24h: {
            type: DataTypes.DECIMAL(7, 2)
        },
        percent_change_7d: {
            type: DataTypes.DECIMAL(7, 2)
        },
        percent_change_30d: {
            type: DataTypes.DECIMAL(7, 2)
        },
        weekly: {
            type: DataTypes.TEXT
        },
        weekly: {
            type: DataTypes.TEXT
        },
        weekly_expire: {
            type: DataTypes.DATE
        },
        keywords: {
            type: DataTypes.STRING(255)
        },
        keywords: {
            type: DataTypes.TEXT
        }
        
    }, {
        timestamps: false,
        freezeTableName: true
    })

    return McwCoins
}