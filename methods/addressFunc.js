import db from '../models/index.js'

const Address = db.addressTbl

export const getAllAddr = async () => {
    try {

        const addrTemp = await Address.findAll({
            attributes: ['address', 'isSynced', 'startBlock', 'endBlock', 'lastTimeStamp'],
    
            where: {
                isActive: true
            }
        })
    
        const data = JSON.stringify(addrTemp, null, 2)
        return JSON.parse(data)

    } catch (error) {
        console.log(error.message)
    }
}

export const updateSyncedState = async (addr) => {
    try {
        await Address.update({ 
            isSynced: true
        }, {
            where: {
              address: addr
            }
        });
    } catch (error) {
        console.log(error.message)
    }
}

export const updateStartBlock = async (startBlock, addr) => {
    try {
        await Address.update({ 
            startBlock: parseInt(startBlock)
        }, {
            where: {
              address: addr
            }
        });
    } catch (error) {
        console.log(error.message)
    }
}

export const updateEndBlock = async (endBlock, addr) => {
    try {
        await Address.update({ 
            endBlock: parseInt(endBlock)
        }, {
            where: {
              address: addr
            }
        });
    } catch (error) {
        console.log(error.message)
    }
}

export const updateTimeStamp = async (ts, addr) => {
    try {
        await Address.update({ 
            lastTimeStamp: ts
        }, {
            where: {
              address: addr
            }
        });
    } catch (error) {
        console.log(error.message)
    }
}

// export default {
//     getAllAddr,
//     updateSyncedState,
//     updateStartBlock,
//     updateEndBlock,
//     updateTimeStamp
// }