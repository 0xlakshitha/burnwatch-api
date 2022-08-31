import db from '../models/index.js'
import logger from '../config/logger.js'

const Address = db.addressTbl

export const getAllAddr = async () => {
    try {

        const addrTemp = await Address.findAll({
            attributes: ['address', 'ercHistory', 'bscHistory'],
    
            where: {
                isActive: true
            }
        })
    
        const data = JSON.stringify(addrTemp, null, 2)
        return JSON.parse(data)

    } catch (error) {
        logger.error(error.message)
    }
}

export const updateErcSyncedState = async (addr) => {
    try {
        await Address.update({ 
            ercHIstory: true
        }, {
            where: {
              address: addr
            }
        });
    } catch (error) {
        logger.error(error.message)
    }
}

export const updateBscSyncedState = async (addr) => {
    try {
        await Address.update({ 
            bscHIstory: true
        }, {
            where: {
              address: addr
            }
        });
    } catch (error) {
        logger.error(error.message)
    }
}

// export default {
//     getAllAddr,
//     updateSyncedState,
//     updateStartBlock,
//     updateEndBlock,
//     updateTimeStamp
// }