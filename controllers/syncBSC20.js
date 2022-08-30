import axios from 'axios'
import Queue from '../methods/Queue.js'
import dotenv from 'dotenv'
import { 
    getAllAddr
} from '../methods/addressFunc.js'
import { addToken } from '../methods/tokenFunc.js'
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

const syncBSC20 = async () => {

    await initQueue()

    const outerFunc = async () => {
        const addr = addressQueue.dequeue()
        

        if(addr) {
            const innerFunc = async () => {

                try {
                    
                    let { data } = await axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&address=${addr.address}&page=1&offset=100&startblock=0&sort=desc&apikey=${apikey}`)
                    
                    const bsc20tokens = data.result

                    const previousData = await redisClient.get(`BSC-${addr.address}`)

                    if(previousData) {
                        const parseTokens = await JSON.parse(previousData)
                        const newBsc20tokens = onlyInLeft(bsc20tokens, parseTokens, isSameToken)
                        
                        if(newBsc20tokens.length > 0) {

                            newBsc20tokens.forEach(async (bsc20) => {
                                if(bsc20.to === addr.address) {
                                    const newBSC20 = { type: 'BSC-20', ...bsc20 }
                                    await addToken(newBSC20)
                                }
                            })
                        }
                        
                    }
                    else {
                        bsc20tokens.forEach(async (bsc20) => {
                            if(bsc20.to === addr.address) {
                                const newBSC20 = { type: 'BSC-20', ...bsc20 }
                                await addToken(newBSC20)
                            }
                        })
                        
                        await redisClient.set(`BSC-${addr.address}`, JSON.stringify(bsc20tokens))

                        setTimeout(() => {
                            outerFunc()
                        }, 2000)

                        return
                    }

                    await redisClient.set(`BSC-${addr.address}`, JSON.stringify(bsc20tokens))

                    setTimeout(() => {
                        outerFunc()
                    }, 2000)

                } catch (error) {
                    innerFunc()
                    // logger.error(error)
                    console.log(error)
                }
            }

            innerFunc()
        } else {
            setTimeout(() => {
                syncBSC20()
            }, 5000) 
            
        }
    }

    outerFunc()

}

export default syncBSC20


