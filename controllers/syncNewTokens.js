import axios from 'axios'
import Queue from '../methods/Queue.js'
import dotenv from 'dotenv'
import { 
    getAllAddr, 
    updateSyncedState, 
    updateStartBlock, 
    updateEndBlock, 
    updateTimeStamp 
} from '../methods/addressFunc.js'
import { addToken } from '../methods/tokenFunc.js'
import Redis from 'redis'
import _ from 'lodash'
import { isSameToken, isSameTxn, onlyInLeft } from '../methods/filterOptions.js'
import logger from '../config/logger.js'

dotenv.config()

const apikey = process.env.API_KEY

let addressQueue = new Queue


const redisClient = Redis.createClient()
// redisClient.connect()


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

const syncNewTokenFunc = async () => {

    await initQueue()

    const outerFunc = async () => {
        const addr = addressQueue.dequeue()

        if(addr) {
            const innerFunc = async () => {

                try {
                    
                    let res = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${addr.address}&page=1&offset=100&startblock=0&sort=desc&apikey=${apikey}`)
                    

                    const data = await res.data
                    const tokens = data.result

                    const previousData = await redisClient.get(addr.address)
                    const previousTxns = await redisClient.get('prevTxns')

                    if(previousData) {
                        const parseTokens = await JSON.parse(previousData)
                        let newElements = onlyInLeft(tokens, parseTokens, isSameToken)

                        if(previousTxns) {
                            const parsePrevTxn = await JSON.parse(previousTxns)
                            newElements = onlyInLeft(newElements, parsePrevTxn, isSameTxn)
                        }
                        
                        if(newElements.length > 0) {

                            newElements.forEach(async (token) => {
                                if(token.to === addr.address) {
                                    await addToken(token)
                                }
                            })

                            await redisClient.set('prevTxns', JSON.stringify(newElements))
                        }
                        
                    }
                    else {
                        if(previousTxns) {
                            const parsePrevTxn = await JSON.parse(previousTxns)
                            let newElements = onlyInLeft(tokens, parsePrevTxn, isSameTxn)

                            if(newElements.length > 0) {

                                newElements.forEach(async (token) => {
                                    if(token.to === addr.address) {
                                        await addToken(token)
                                    }
                                })

                                await redisClient.set(addr.address, JSON.stringify(tokens))
                                await redisClient.set('prevTxns', JSON.stringify(newElements))
                            }

                            setTimeout(() => {
                                outerFunc()
                            },2000)
                            return
                        }

                        console.log('no prev data')
                        tokens.forEach(async (token) => {
                            if(token.to === addr.address) {
                                await addToken(token)
                            }
                        })
                        
                        await redisClient.set(addr.address, JSON.stringify(tokens))
                        await redisClient.set('prevTxns', JSON.stringify(tokens))
                        setTimeout(() => {
                            outerFunc()
                        },2000)
                        
                        return
                    }

                    await redisClient.set(addr.address, JSON.stringify(tokens))

                    setTimeout(() => {
                        outerFunc()
                    }, 2000)

                } catch (error) {
                    logger.error(error)
                }
            }

            innerFunc()
        } else {
            setTimeout(() => {
                syncNewTokenFunc()
            }, 5000)
            
        }
    }

    outerFunc()

}

export default syncNewTokenFunc


