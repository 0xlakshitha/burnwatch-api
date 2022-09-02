import ageGenerator from '../methods/ageGenerator.js'

export default (sequelize, DataTypes) => {
    const TokenTxn = sequelize.define('TokenBurn', {
        tokenType: {
            type: DataTypes.STRING,
        },
        txnHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        blockNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timeStamp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        age: {
            type: DataTypes.VIRTUAL,
            
            get() {
                const age = ageGenerator(this.timeStamp)
                return age
            },
            set(value) {
                throw new Error('Do not try to set the `age` value!');
            }
        },
        from: {
            type: DataTypes.STRING,
        },
        to: {
            type: DataTypes.STRING
        },
        contractAddress: {
            type: DataTypes.STRING
        },
        value: {
            type: DataTypes.STRING,
        },
        fixedValue: {
            type: DataTypes.STRING
        },
        tokenName: {
            type: DataTypes.STRING
        },
        tokenSymbol: {
            type: DataTypes.STRING
        },
        tokenDecimal: {
            type: DataTypes.STRING
        },
        token: {
            type: DataTypes.VIRTUAL,
            
            get() {
                if(this.tokenName && this.tokenSymbol) {
                    return `${this.tokenName} (${this.tokenSymbol})`
                }else {
                    return ''
                }
            },
            set(value) {
                throw new Error('Do not try to set the `token` value!');
            }
        },
    }, {
        timestamps: false
    })

    return TokenTxn
}