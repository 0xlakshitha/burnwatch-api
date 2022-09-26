import { db, dreamhostDB } from '../models/index.js'
import logger from '../config/logger.js'

const DreamHostSum = dreamhostDB.burnSum
const LocalSum = db.burnSum

const getDreamhostTokens = async () => {
    try {
        let tokens = await DreamHostSum.findAll({
            attributes: ['token']
        })
    
        tokens = JSON.stringify(tokens, null, 2)
        const dhtokens = JSON.parse(tokens)
    
        const onlyTokens = dhtokens.map(token => {
            return token.token
        })

        return onlyTokens

    } catch (error) {
        logger.error(error.message)
    }
}

const getLocalTokens = async () => {
    try {
        let tokens = await LocalSum.findAll({
            attributes: ['token']
        })
    
        tokens = JSON.stringify(tokens, null, 2)
        const dhtokens = JSON.parse(tokens)
    
        const onlyTokens = dhtokens.map(token => {
            return token.token
        })

        return onlyTokens

    } catch (error) {
        logger.error(error.message)
    }
}

const syncBurnSum = async () => {

    try {
        let localSums = await LocalSum.findAll()

        localSums = JSON.stringify(localSums, null, 2)
        const burnSums = JSON.parse(localSums)

        if(burnSums.length > 0) {
            burnSums.forEach(async (sum) => {
                try {
                    const {token, ...data} = sum

                    const [ newSum, created ] = await DreamHostSum.findOrCreate({
                        where: { token: token },
                        defaults: data
                    })
                } catch (error) {
                    logger.error(error.message)
                }
            })

            const dhSumCount = await DreamHostSum.count()
            const localMSumCount = await LocalSum.count()

            if(localMSumCount < dhSumCount){
                const dreamhostTokens = await getDreamhostTokens()
                const localTokens = await getLocalTokens()

                dreamhostTokens.forEach(async (token) => {
                    try {
                        if(localTokens.includes(token)) {
                            return
                        }
                        else {
                            console.log('one')
                            await DreamHostSum.destroy({
                                where: {
                                  token: token
                                }
                            });
                        }
                    } catch (error) {
                        logger.error(error.message)
                    }
                })
            }

            burnSums.forEach(async (sum) => {
                try {
                    const {token, ...data} = sum

                    await DreamHostSum.update(data, {
                        where: {
                        token: token
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

export default syncBurnSum
