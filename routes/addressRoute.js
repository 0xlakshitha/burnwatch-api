import express from 'express'

const router = express.Router()

import { 
    getAll,
    addAddress,
    pauseAddress,
    startAddress,
    removeAddress
} from '../controllers/address.js'

router.get('/', getAll)

router.post('/', addAddress)

router.put('/pause/:address', pauseAddress)

router.put('/start/:address', startAddress)

router.delete('/remove/:address', removeAddress)

export default router