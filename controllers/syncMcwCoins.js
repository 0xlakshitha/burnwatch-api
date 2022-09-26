import { db, dreamhostDB } from '../models/index.js'
import logger from '../config/logger.js'

const DreamHostMcw = dreamhostDB.mcwCoin
const LocalMcw = db.mcwCoin

const getDreamhostIds = async () => {
    try {
        let ids = await DreamHostMcw.findAll({
            attributes: ['id']
        })
    
        ids = JSON.stringify(ids, null, 2)
        const dhids = JSON.parse(ids)
    
        const onlyIds = dhids.map(id => {
            return id.id
        })

        return onlyIds

    } catch (error) {
        logger.error(error.message)
    }
}

const getLocalIds = async () => {
    try {
        let ids = await LocalMcw.findAll({
            attributes: ['id']
        })
    
        ids = JSON.stringify(ids, null, 2)
        const dhids = JSON.parse(ids)
    
        const onlyIds = dhids.map(id => {
            return id.id
        })

        return onlyIds
        
    } catch (error) {
        logger.error(error.message)
    }
}


const syncMcwCoins = async () => {

    try {
        let coins = await DreamHostMcw.findAll()

        coins = JSON.stringify(coins, null, 2)
        const mcwCoins = JSON.parse(coins)

        if(mcwCoins.length > 0) {
            mcwCoins.forEach(async (coin) => {
                try {
                    const {id, ...data} = coin

                    const [ newCoin, created ] = await LocalMcw.findOrCreate({
                        where: { id: id },
                        defaults: data
                    })
                } catch (error) {
                    logger.error(error.message)
                }
            })

            const dhMcwCount = await DreamHostMcw.count()
            const localMcwCount = await LocalMcw.count()

            if(dhMcwCount < localMcwCount){
                const dreamhostIds = await getDreamhostIds()
                const localIds = await getLocalIds()

                localIds.forEach(async (id) => {
                    try {
                        if(dreamhostIds.includes(id)) {
                            return
                        }
                        else {
                            await LocalMcw.destroy({
                                where: {
                                  id: id
                                }
                            });
                        }
                    } catch (error) {
                        logger.error(error.message) 
                    }
                })
            }

            mcwCoins.forEach(async (coin) => {
                try {
                    const {id, name, symbol, slug, img, ...data} = coin

                    await LocalMcw.update(data, {
                        where: {
                        id: id
                        }
                    });
                } catch (error) {
                    logger.error(error.message)
                }
                
            })
        }
    } catch (error) {
        logger.error(error.message)
    }
}

export default syncMcwCoins
