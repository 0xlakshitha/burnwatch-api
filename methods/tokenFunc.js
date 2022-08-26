import db from '../models/index.js'

const Token = db.tokenTbl

export const addToken = async (token) => {
    const newToken = {
        txnHash: token.hash,
        blockNumber: token.blockNumber,
        timeStamp: token.timeStamp,
        from: token.from,
        to: token.to,
        value: token.value,
        tokenName: token.tokenName,
        tokenSymbol: token.tokenSymbol
    }

    try {
        await Token.create(newToken)
    } catch (error) {
        console.log(error.message)
    }
}