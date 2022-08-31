import logger from '../config/logger.js'
import db from '../models/index.js'
import sequelize from 'sequelize'

const Token = db.tokenTbl

const getTrueValue = (value, decimal) => {
    if(decimal !== '') {
        const newValue = parseInt(value) / Math.pow(10, parseInt(decimal))
        return newValue.toString()
    }
    else {
        return ''
    }
}

export const addToken = async (token) => {
    const newToken = {
        tokenType: token.type,
        txnHash: token.hash,
        blockNumber: token.blockNumber,
        timeStamp: token.timeStamp,
        from: token.from,
        to: token.to,
        value: token.value,
        fixedValue: getTrueValue(token.value, token.tokenDecimal),
        contractAddress: token.contractAddress,
        tokenName: token.tokenName,
        tokenSymbol: token.tokenSymbol,
        tokenDecimal: token.tokenDecimal
    }

    try {
        await Token.create(newToken)
    } catch (error) {
        logger.error(error.message)
    }
}

export const getEndBlock = async (type, address) => {
    try {
        let endblock = await Token.findOne({
            attributes: ['blockNumber'],
            where: {
                to: address,
                tokenType: type
            },
            order: sequelize.literal('timeStamp ASC'),
        })

        endblock = JSON.stringify(endblock, null, 2)
        endblock = JSON.parse(endblock)

        return endblock.blockNumber

    } catch (error) {
        logger.error(error.message)
    }
}