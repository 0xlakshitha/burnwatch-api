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

const apikey = process.env.ERC_API_KEY

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

const erc20DailyRec = async () => {

    await initQueue()
    const tokenSymbols = await getTokenSymbols()

    const outerFunc = async () => {
        const addr = addressQueue.dequeue()
        const endtime = Math.floor(Date.now() / 1000)
        const starttime = endtime - 86400


        if(addr) {
            const dailyBlock = await getDayBlock('ERC-20', addr.address, starttime, endtime)

            if(dailyBlock) {

                let block = null
                let pageNumber = null

                const innerFunc = async (pageNbr = 1, blockNumber) => {
                    let endblock = blockNumber ? blockNumber : dailyBlock[0].blockNumber
                    let page = pageNbr > 10 ? 1 : pageNbr

                    block = endblock

                    let isCompleted = false
    
                    try {
                        
                        let { data } = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${addr.address}&page=${page}&offset=1000&startblock=0&endblock=${endblock}&sort=desc&apikey=${apikey}`)
                        
                        const erc20tokens = data.result

                        const filteredErc20 = erc20tokens.filter(token => (
                            token.to === addr.address && tokenSymbols.includes(token.tokenSymbol)
                        ))

                        const newErc20tokens = onlyInLeft(filteredErc20, dailyBlock, isSameTokenDB)
                        
                        if(newErc20tokens.length > 0) {

                            for(let i = 0; i < newErc20tokens.length; i++) {
                                if(parseInt(newErc20tokens[i].timeStamp) <= starttime) {
                                    
                                    isCompleted = true;
                                    break
                                    
                                }
                                else {

                                    const newERC20 = { type: 'ERC-20', ...newErc20tokens[i] }
                                    await addToken(newERC20)

                                }
                            }
                        }
                        else {
                            if(filteredErc20[filteredErc20.length -1].timeStamp <= starttime) {
                                isCompleted = true
                            }
                        }
                            

                        if(page === 10) {
                            endblock = erc20tokens[erc20tokens.length - 1].blockNumber
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

export default erc20DailyRec


