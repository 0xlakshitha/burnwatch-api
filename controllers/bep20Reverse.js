import axios from 'axios'
import Queue from '../methods/Queue.js'
import dotenv from 'dotenv'
import { 
    getAllAddr,
    updateBepSyncedState
} from '../methods/addressFunc.js'
import { getEndBlock } from '../methods/tokenFunc.js'
import { addToken, getTokenSymbols } from '../methods/tokenFunc.js'
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

const bep20Reverse = async () => {

    await initQueue()
    const tokenSymbols = await getTokenSymbols()

    const outerFunc = async () => {
        const addr = addressQueue.dequeue()
        

        if(addr) {
            if(!addr.bepHistory) {

                let lastTokens = await redisClient.get(`BEPHistory-${addr.address}`)

                if(lastTokens) {

                    const innerFunc = async (pageNbr = 1, blockNumber) => {
                        let endblock = blockNumber ? blockNumber : await getEndBlock('BEP-20', addr.address)
                        let page = pageNbr > 10 ? 1 : pageNbr

                        let isCompleted = false
        
                        try {
                            
                            let { data } = await axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&address=${addr.address}&page=${page}&offset=1000&startblock=0&endblock=${endblock}&sort=desc&apikey=${apikey}`)
                            
                            const bep20tokens = data.result

                            let lastTokens = await redisClient.get(`BEPHistory-${addr.address}`)

                            const parseTokens = await JSON.parse(lastTokens)
                            const newBEP20tokens = onlyInLeft(bep20tokens, parseTokens, isSameToken)
                            
                            if(newBEP20tokens.length > 0) {

                                for(let i = 0; i < newBEP20tokens.length; i++) {
                                    if(parseInt(newBEP20tokens[i].timeStamp) <= 1640995200) {
                                        
                                        await updateBepSyncedState(addr.address)
                                        isCompleted = true;
                                        break
                                        
                                    }
                                    else {
                                        if(newBEP20tokens[i].to === addr.address && tokenSymbols.includes(newBEP20tokens[i].tokenSymbol)) {
                                            const newBEP20 = { type: 'BEP-20', ...newBEP20tokens[i] }
                                            await addToken(newBEP20)
                                        }
                                    }
                                }
                            }
                                
        
                            await redisClient.set(`BEPHistory-${addr.address}`, JSON.stringify(bep20tokens))

                            if(page === 10) {
                                endblock = bep20tokens[bep20tokens.length - 1].blockNumber
                            }

                            page++

                            if(isCompleted){
                                outerFunc()
                                return
                            }
                            else {
                                setTimeout(() => {
                                    innerFunc(page, endblock)
                                }, 2000)    
                            }

                            // setTimeout(() => {
                            //     innerFunc(page, endblock)
                            // }, 2000)
                            
                        } catch (error) {
                            innerFunc()
                            logger.error(error)
                        }
                    }
        
                    innerFunc()
                }
                else {
                    setTimeout(() => {
                        outerFunc()
                    }, 2000)
                }
            }
            else {
                setTimeout(() => {
                    outerFunc()
                }, 5000)
            }
            

        } else {
            setTimeout(() => {
                bep20Reverse()
            }, 20000) 
            
        }
    }

    outerFunc()

}

export default bep20Reverse


