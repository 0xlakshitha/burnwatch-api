import axios from 'axios'
import Queue from '../methods/Queue.js'
import dotenv from 'dotenv'
import { 
    getAllAddr
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

const syncERC20 = async () => {

    await initQueue()

    const outerFunc = async () => {
        const addr = addressQueue.dequeue()
        

        if(addr) {
            const innerFunc = async () => {

                try {
                    
                    let { data } = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${addr.address}&page=1&offset=100&startblock=0&sort=desc&apikey=${apikey}`)
                    
                    const erc20tokens = data.result

                    const previousData = await redisClient.get(addr.address)

                    if(previousData) {
                        const parseTokens = await JSON.parse(previousData)
                        const newErc20tokens = onlyInLeft(erc20tokens, parseTokens, isSameToken)
                        
                        if(newErc20tokens.length > 0) {

                            newErc20tokens.forEach(async (erc20) => {
                                if(erc20.to === addr.address) {
                                    const newERC20 = { type: 'ERC-20', ...erc20 }
                                    await addToken(newERC20)
                                }
                            })
                        }
                        
                    }
                    else {
                        erc20tokens.forEach(async (erc20) => {
                            if(erc20.to === addr.address) {
                                const newERC20 = { type: 'ERC-20', ...erc20 }
                                await addToken(newERC20)
                            }
                        })
                        
                        await redisClient.set(addr.address, JSON.stringify(erc20tokens))

                        setTimeout(() => {
                            outerFunc()
                        }, 2000)

                        return
                    }

                    await redisClient.set(addr.address, JSON.stringify(erc20tokens))

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
                syncERC20()
            }, 5000) 
            
        }
    }

    outerFunc()

}

export default syncERC20


