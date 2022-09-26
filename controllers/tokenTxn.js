import { db } from '../models/index.js'
import sequelize from 'sequelize'
import logger from '../config/logger.js'

const TokenTxn = db.tokenTbl

/* 
===========================================================
=================== GET ALL TXNS ==========================
===========================================================
*/

export const getAll = async (req,res) => {
    const sortingOpt = req.query

    try {
        let tokentxns

        if(sortingOpt.page && !sortingOpt.pagesize) {
            tokentxns = await TokenTxn.findAll({
                attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                where: {
                    timeStamp: {
                        [sequelize.Op.and] : {
                            [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                            [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                        }
                    }
                },
                order: sequelize.literal('timeStamp DESC'),
                offset: (parseInt(sortingOpt.page) * 100) - 100,
                limit: 100
            })
        }

        else if(sortingOpt.pagesize && !sortingOpt.page) {
            tokentxns = await TokenTxn.findAll({
                attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                where: {
                    timeStamp: {
                        [sequelize.Op.and] : {
                            [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                            [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                        }
                    }
                },
                order: sequelize.literal('timeStamp DESC'),
                limit: parseInt(sortingOpt.pagesize)
            })
        }

        else if(sortingOpt.page && sortingOpt.pagesize) {
            tokentxns = await TokenTxn.findAll({
                attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                where: {
                    timeStamp: {
                        [sequelize.Op.and] : {
                            [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                            [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                        }
                    }
                },
                order: sequelize.literal('timeStamp DESC'),
                offset: parseInt(sortingOpt.page) * parseInt(sortingOpt.pagesize) - parseInt(sortingOpt.pagesize),
                limit: parseInt(sortingOpt.pagesize)
            })
        }

        else {
            tokentxns = await TokenTxn.findAll({
                attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                where: {
                    timeStamp: {
                        [sequelize.Op.and] : {
                            [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                            [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                        }
                    }
                },
                order: sequelize.literal('timeStamp DESC'),
                limit: 100
            })
        }
        


        if(tokentxns.length === 0) {
            return res.status(404).json('No token txns')
        }

        const tokenStr = JSON.stringify(tokentxns, null, 2)
        const tokenJson = JSON.parse(tokenStr)

        res.status(200).json(tokenJson)

    } catch (error) {
        logger.error(error)
        res.status(500).json(error)
    }
}

/* 
===========================================================
=================== GET BY ADDRESS ========================
===========================================================
*/

export const getAllByAddress = async (req, res) => {
    const address = req.params.address
    const sortingOpt = req.query

    try {
        let tokentxns

        if(sortingOpt.token) {
            if(sortingOpt.page && !sortingOpt.pagesize) {
                tokentxns = await TokenTxn.findAll({
                    attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                    where: {
                        
                        to : address,
                        tokenSymbol : sortingOpt.token,
                        timeStamp: {
                            [sequelize.Op.and] : {
                                [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                                [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                            }
                        }
                        
                    },
                    order: sequelize.literal('timeStamp DESC'),
                    offset: (parseInt(sortingOpt.page) * 100) - 100,
                    limit: 100
                })
            }
    
            else if(sortingOpt.pagesize && !sortingOpt.page) {
                tokentxns = await TokenTxn.findAll({
                    attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                    where: {
                        
                        to : address,
                        tokenSymbol : sortingOpt.token,
                        timeStamp: {
                            [sequelize.Op.and] : {
                                [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                                [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                            }
                        }
                        
                    },
                    order: sequelize.literal('timeStamp DESC'),
                    limit: parseInt(sortingOpt.pagesize)
                })
            }
    
            else if(sortingOpt.page && sortingOpt.pagesize) {
                tokentxns = await TokenTxn.findAll({
                    attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                    where: {
                        
                        to : address,
                        tokenSymbol : sortingOpt.token,
                        timeStamp: {
                            [sequelize.Op.and] : {
                                [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                                [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                            }
                        }
                        
                    },
                    order: sequelize.literal('timeStamp DESC'),
                    offset: parseInt(sortingOpt.page) * parseInt(sortingOpt.pagesize) - parseInt(sortingOpt.pagesize),
                    limit: parseInt(sortingOpt.pagesize)
                })
            }
    
            else {
                tokentxns = await TokenTxn.findAll({
                    attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                    where: {
                        
                        to : address,
                        tokenSymbol : sortingOpt.token,
                        timeStamp: {
                            [sequelize.Op.and] : {
                                [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                                [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                            }
                        }
                        
                    },
                    order: sequelize.literal('timeStamp DESC'),
                    limit: 100
                })
            }
        }
        else {
            if(sortingOpt.page && !sortingOpt.pagesize) {
                tokentxns = await TokenTxn.findAll({
                    attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                    where: {
                        to : address,
                        timeStamp: {
                            [sequelize.Op.and] : {
                                [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                                [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                            }
                        }
                    },
                    order: sequelize.literal('timeStamp DESC'),
                    offset: (parseInt(sortingOpt.page) * 100) - 100,
                    limit: 100
                })
            }
    
            else if(sortingOpt.pagesize && !sortingOpt.page) {
                tokentxns = await TokenTxn.findAll({
                    attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                    where: {
                        to : address,
                        timeStamp: {
                            [sequelize.Op.and] : {
                                [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                                [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                            }
                        }
                    },
                    order: sequelize.literal('timeStamp DESC'),
                    limit: parseInt(sortingOpt.pagesize)
                })
            }
    
            else if(sortingOpt.page && sortingOpt.pagesize) {
                tokentxns = await TokenTxn.findAll({
                    attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                    where: {
                        to : address,
                        timeStamp: {
                            [sequelize.Op.and] : {
                                [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                                [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                            }
                        }
                    },
                    order: sequelize.literal('timeStamp DESC'),
                    offset: parseInt(sortingOpt.page) * parseInt(sortingOpt.pagesize) - parseInt(sortingOpt.pagesize),
                    limit: parseInt(sortingOpt.pagesize)
                })
            }
    
            else {
                tokentxns = await TokenTxn.findAll({
                    attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                    where: {
                        to : address,
                        timeStamp: {
                            [sequelize.Op.and] : {
                                [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                                [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                            }
                        }
                    },
                    order: sequelize.literal('timeStamp DESC'),
                    limit: 100
                })
            }
        }
        

        if(tokentxns.length === 0) {
            return res.status(404).json('No token txns')
        }

        const tokenStr = JSON.stringify(tokentxns, null, 2)
        const tokenJson = JSON.parse(tokenStr)

        res.status(200).json(tokenJson)

    } catch (error) {
        logger.error(error)
        res.status(500).json(error)
    }
}


/* 
===========================================================
=================== GET BY TXN HASH =======================
===========================================================
*/


export const getByHash = async (req, res) => {
    const txnHash = req.params.txnhash

    try {

        const tokentxns = await TokenTxn.findAll({
            attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
            where: {
                txnHash : txnHash
            },
            order: sequelize.literal('timeStamp DESC'),
        })
       

        if(tokentxns.length === 0) {
            return res.status(404).json('No token txns')
        }

        const tokenStr = JSON.stringify(tokentxns, null, 2)
        const tokenJson = JSON.parse(tokenStr)

        res.status(200).json(tokenJson)

    } catch (error) {
        logger.error(error)
        res.status(500).json(error)
    }
}


/* 
===========================================================
=================== GET BY TOKEN SYMBOL ===================
===========================================================
*/


export const getByToken = async (req, res) => {
    const token = req.params.token
    const sortingOpt = req.query

    try {
        let tokentxns

        if(sortingOpt.page && !sortingOpt.pagesize) {
            tokentxns = await TokenTxn.findAll({
                attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                where: {
                    tokenSymbol : token,
                    timeStamp: {
                        [sequelize.Op.and] : {
                            [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                            [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                        }
                    }
                },
                order: sequelize.literal('timeStamp DESC'),
                offset: (parseInt(sortingOpt.page) * 100) - 100,
                limit: 100
            })
        }

        else if(sortingOpt.pagesize && !sortingOpt.page) {
            tokentxns = await TokenTxn.findAll({
                attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                where: {
                    tokenSymbol : token,
                    timeStamp: {
                        [sequelize.Op.and] : {
                            [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                            [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                        }
                    }
                },
                order: sequelize.literal('timeStamp DESC'),
                limit: parseInt(sortingOpt.pagesize)
            })
        }

        else if(sortingOpt.page && sortingOpt.pagesize) {
            tokentxns = await TokenTxn.findAll({
                attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                where: {
                    tokenSymbol : token,
                    timeStamp: {
                        [sequelize.Op.and] : {
                            [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                            [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                        }
                    }
                },
                order: sequelize.literal('timeStamp DESC'),
                offset: parseInt(sortingOpt.page) * parseInt(sortingOpt.pagesize) - parseInt(sortingOpt.pagesize),
                limit: parseInt(sortingOpt.pagesize)
            })
        }

        else {
            tokentxns = await TokenTxn.findAll({
                attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
                where: {
                    tokenSymbol : token,
                    timeStamp: {
                        [sequelize.Op.and] : {
                            [sequelize.Op.lte] : sortingOpt.endtime ? parseInt(sortingOpt.endtime) : 32503683661,
                            [sequelize.Op.gte] : sortingOpt.starttime ? parseInt(sortingOpt.starttime) : 0
                        }
                    }
                },
                order: sequelize.literal('timeStamp DESC'),
                limit: 100
            })
        }

        if(tokentxns.length === 0) {
            return res.status(404).json('No token txns')
        }

        const tokenStr = JSON.stringify(tokentxns, null, 2)
        const tokenJson = JSON.parse(tokenStr)

        res.status(200).json(tokenJson)

    } catch (error) {
        logger.error(error)
        res.status(500).json(error.message)
    }
}


/* 
===========================================================
=================== GET BY TIMESTAMP =======================
===========================================================
*/


export const getByTimeStamp = async (req, res) => {
    const timeStamp = req.params.timestamp

    try {

        const tokentxns = await TokenTxn.findAll({
            attributes: ['txnHash', 'timeStamp', 'age', 'from', 'to', 'value', 'tokenName', 'tokenSymbol', 'token'],
            where: {
                timeStamp : timeStamp
            },
            order: sequelize.literal('timeStamp DESC'),
        })
       

        if(tokentxns.length === 0) {
            return res.status(404).json('No token txns')
        }

        const tokenStr = JSON.stringify(tokentxns, null, 2)
        const tokenJson = JSON.parse(tokenStr)

        res.status(200).json(tokenJson)

    } catch (error) {
        logger.error(error)
        res.status(500).json(error)
    }
}


