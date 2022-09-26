import express from 'express'
import sequelize from 'sequelize'

const router = express.Router()

import { 
    getAll, 
    getAllByAddress, 
    getByHash, 
    getByToken, 
    getByTimeStamp,
} from '../controllers/tokenTxn.js'

router.get('/', getAll)

router.get('/:address', getAllByAddress)

router.get('/hash/:txnhash', getByHash)

router.get('/token/:token', getByToken)

router.get('/timestamp/:timestamp', getByTimeStamp)

export default router