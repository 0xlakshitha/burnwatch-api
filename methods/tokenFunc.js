import db from '../models/index.js'

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
        console.log(error.message)
    }
}