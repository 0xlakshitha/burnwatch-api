import axios from 'axios'
import Queue from '../methods/Queue.js'
import dotenv from 'dotenv'
import { 
    getAllAddr
} from '../methods/addressFunc.js'
import { addToken, getTokenSymbols, getDayBlock } from '../methods/tokenFunc.js'
import Redis from 'redis'
import { isSameToken, isSameTokenDB, onlyInLeft } from '../methods/filterOptions.js'
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

const bep20DailyRec = async () => {

    await initQueue()
    const tokenSymbols = await getTokenSymbols()

    const outerFunc = async () => {
        const addr = addressQueue.dequeue()
        const endtime = Math.floor(Date.now() / 1000)
        const starttime = endtime - 86400


        if(addr) {
            const dailyBlock = await getDayBlock('BEP-20', addr.address, starttime, endtime)

            if(dailyBlock) {

                let block = null
                let pageNumber = null

                const innerFunc = async (pageNbr = 1, blockNumber) => {
                    let endblock = blockNumber ? blockNumber : dailyBlock[0].blockNumber
                    let page = pageNbr > 10 ? 1 : pageNbr

                    block = endblock

                    let isCompleted = false
    
                    try {
                        
                        let { data } = await axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&address=${addr.address}&page=${page}&offset=1000&startblock=0&endblock=${endblock}&sort=desc&apikey=${apikey}`)
                        
                        const bep20tokens = data.result

                        const filteredBep20 = bep20tokens.filter(token => (
                            token.to === addr.address && tokenSymbols.includes(token.tokenSymbol)
                        ))

                        const newBep20tokens = onlyInLeft(filteredBep20, dailyBlock, isSameTokenDB)
                        
                        if(newBep20tokens.length > 0) {

                            for(let i = 0; i < newBep20tokens.length; i++) {
                                if(parseInt(newBep20tokens[i].timeStamp) <= starttime) {
                                    
                                    isCompleted = true;
                                    break
                                    
                                }
                                else {

                                    const newBEP20 = { type: 'BEP-20', ...newBep20tokens[i] }
                                    await addToken(newBEP20)

                                }
                            }
                        }
                            
                        if(page === 10) {
                            endblock = bep20tokens[bep20tokens.length - 1].blockNumber
                        }

                        page++

                        pageNumber = page

                        if(isCompleted){
                            outerFunc()
                            return
                        }
                        else {
                            innerFunc(page, endblock)    
                        }

                        
                    } catch (error) {
                        innerFunc(pageNumber, block)
                        logger.error(error.message)
                    }
                }
    
                innerFunc()
            }
            else {
                setTimeout(() => {
                    outerFunc()
                }, 2000)
            }
             

        } else {
            return
        }
    }

    outerFunc()

}

export default bep20DailyRec


