import logger from '../config/logger.js'
import db from '../models/index.js'
import sequelize from 'sequelize'

const Token = db.tokenTbl
const Symbol = db.symbolTbl

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

export const getTokenSymbols = async () => {
    try {
        let symbols = await Symbol.findAll({
            attributes: ['symbol']
        })

        symbols = JSON.stringify(symbols, null, 2)
        symbols = JSON.parse(symbols)

        symbols = symbols.map(symbol => {
            return symbol.symbol
        })

        return symbols
    } catch (error) {
        logger.error(error.message)
    }
}


export const getStartBlock = async (type, address) => {
    try {
        let startblock = await Token.findOne({
            attributes: ['blockNumber'],
            where: {
                to: address,
                tokenType: type
            },
            order: sequelize.literal('timeStamp DESC'),
        })

        startblock = JSON.stringify(startblock, null, 2)
        startblock = JSON.parse(startblock)

        return startblock.blockNumber

    } catch (error) {
        logger.error(error.message)
    }
}


export const getDayBlock = async (type, address, starttime, endtime) => {
    try {
        let tokenBurns = await Token.findAll({
            attributes: ['txnHash', 'blockNumber', 'timeStamp', 'from', 'to', 'contractAddress', 'value', 'tokenName', 'tokenSymbol', 'tokenDecimal'],
            where: {
                tokenType: type,
                to: address,
                timeStamp: {
                    [sequelize.Op.and] : {
                        [sequelize.Op.lte] : endtime ,
                        [sequelize.Op.gte] : starttime
                    }
                }
            },
            order: sequelize.literal('timeStamp DESC')
        })

        tokenBurns = JSON.stringify(tokenBurns, null, 2)
        tokenBurns = JSON.parse(tokenBurns)

        return tokenBurns

    } catch (error) {
        logger.error(error.message)
    }
}