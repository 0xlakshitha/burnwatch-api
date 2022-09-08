import axios from 'axios'
import Queue from '../methods/Queue.js'
import dotenv from 'dotenv'
import { 
    getAllAddr
} from '../methods/addressFunc.js'
import { addToken, getTokenSymbols, getStartBlock } from '../methods/tokenFunc.js'
import Redis from 'redis'
import { isSameToken, isSameTxn, onlyInLeft } from '../methods/filterOptions.js'
import logger from '../config/logger.js'

dotenv.config()

const apikey = process.env.BSC_API_KEY

let addressQueue = new Queue


const redisClient = Redis.createClient()
redisClient.connect()


const initQueue = async () => {
    const address = await getAllAddr()
    
    if(address) {
        address.forEach(addr => {
            addressQueue.enqueue(addr)
        })
    }
    else {
        return
    }
}

const syncBEP20 = async () => {

    await initQueue()
    const tokenSymbols = await getTokenSymbols()

    const outerFunc = async () => {
        const addr = addressQueue.dequeue()
        

        if(addr) {
            const innerFunc = async () => {

                const startblock = await getStartBlock('BEP-20', addr.address)

                try {
                    
                    let { data } = startblock ? 
                            await axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&address=${addr.address}&page=1&offset=10000&startblock=${startblock}&sort=desc&apikey=${apikey}`)
                            :
                            await axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&address=${addr.address}&page=1&offset=100&startblock=0&sort=desc&apikey=${apikey}`)
                    
                    const bep20tokens = data.result

                    const previousData = await redisClient.get(`BEP-${addr.address}`)

                    if(previousData) {
                        const parseTokens = await JSON.parse(previousData)
                        const newBEP20tokens = onlyInLeft(bep20tokens, parseTokens, isSameToken)
                        
                        if(newBEP20tokens.length > 0) {

                            newBEP20tokens.forEach(async (bep20) => {
                                if(bep20.to === addr.address && tokenSymbols.includes(bep20.tokenSymbol)) {
                                    const newbep20 = { type: 'BEP-20', ...bep20 }
                                    await addToken(newbep20)
                                }
                            })
                        }
                        
                    }
                    else {
                        bep20tokens.forEach(async (bep20) => {
                            if(bep20.to === addr.address && tokenSymbols.includes(bep20.tokenSymbol)) {
                                const newbep20 = { type: 'BEP-20', ...bep20 }
                                await addToken(newbep20)
                            }
                        })
                        
                        await redisClient.set(`BEP-${addr.address}`, JSON.stringify(bep20tokens))

                        setTimeout(() => {
                            outerFunc()
                        }, 2000)

                        return
                    }

                    await redisClient.set(`BEP-${addr.address}`, JSON.stringify(bep20tokens))
                    await redisClient.set(`BEPHistory-${addr.address}`, JSON.stringify(bep20tokens))

                    setTimeout(() => {
                        outerFunc()
                    }, 2000)

                } catch (error) {
                    innerFunc()
                    logger.error(error)
                }
            }

            innerFunc()
        } else {
            setTimeout(() => {
                syncBEP20()
            }, 5000) 
            
        }
    }

    outerFunc()

}

export default syncBEP20


