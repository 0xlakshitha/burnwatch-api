import axios from 'axios'
import Queue from '../methods/Queue.js'
import dotenv from 'dotenv'
import { 
    getAllAddr,
    updateErcSyncedState
} from '../methods/addressFunc.js'
import { getEndBlock } from '../methods/tokenFunc.js'
import { addToken, getTokenSymbols } from '../methods/tokenFunc.js'
import Redis from 'redis'
import { isSameToken, isSameTxn, onlyInLeft } from '../methods/filterOptions.js'
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

const erc20Reverse = async () => {

    await initQueue()
    const tokenSymbols = await getTokenSymbols()

    const outerFunc = async () => {
        const addr = addressQueue.dequeue()
        

        if(addr) {
            if(!addr.ercHistory) {
                console.log(`erc reverse running for ${addr.address}`)

                let lastTokens = await redisClient.get(`ERCHistory-${addr.address}`)

                if(lastTokens) {

                    console.log('have last tokens')
                    const innerFunc = async (pageNbr = 1, blockNumber) => {
                        let endblock = blockNumber ? blockNumber : await getEndBlock('ERC-20', addr.address)
                        let page = pageNbr > 10 ? 1 : pageNbr
                        console.log(endblock)
                        let isCompleted = false
        
                        console.log(page)
                        try {
                            
                            let { data } = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${addr.address}&page=${page}&offset=1000&startblock=0&endblock=${endblock}&sort=desc&apikey=${apikey}`)
                            
                            const erc20tokens = data.result

                            console.log(erc20tokens.length)

                            let lastTokens = await redisClient.get(`ERCHistory-${addr.address}`)

                            const parseTokens = await JSON.parse(lastTokens)
                            const newErc20tokens = onlyInLeft(erc20tokens, parseTokens, isSameToken)

                            console.log(newErc20tokens.length)
                            
                            if(newErc20tokens.length > 0) {

                                // newErc20tokens.forEach(async (erc20) => {
                                //     if(parseInt(erc20.timeStamp) <= 1661385600) {
                                        
                                //         await updateErcSyncedState(addr.address)
                                //         isCompleted = true
                                        
                                //     }
                                //     else {
                                //         if(erc20.to === addr.address) {
                                //             const newERC20 = { type: 'ERC-20', ...erc20 }
                                //             await addToken(newERC20)
                                //         }
                                //     }
                                // })

                                for(let i = 0; i < newErc20tokens.length; i++) {
                                    if(parseInt(newErc20tokens[i].timeStamp) <= 1640995200) {
                                        
                                        await updateErcSyncedState(addr.address)
                                        isCompleted = true;
                                        break
                                        
                                    }
                                    else {
                                        if(newErc20tokens[i].to === addr.address && tokenSymbols.includes(newErc20tokens[i].tokenSymbol)) {
                                            const newERC20 = { type: 'ERC-20', ...newErc20tokens[i] }
                                            await addToken(newERC20)
                                        }
                                    }
                                }
                            }
                                
        
                            await redisClient.set(`ERCHistory-${addr.address}`, JSON.stringify(erc20tokens))

                            if(page === 10) {
                                endblock = erc20tokens[erc20tokens.length - 1].blockNumber
                            }

                            page++

                            console.log(isCompleted)

                            if(isCompleted){
                                console.log('erc history complete')
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
                    console.log('no last tokens. i am out')
                    setTimeout(() => {
                        outerFunc()
                    }, 2000)
                }
            }
            else {
                console.log(`${addr.address} already synced`)
                setTimeout(() => {
                    outerFunc()
                }, 5000)
            }
            

        } else {
            console.log('no addresses to get history')
            setTimeout(() => {
                erc20Reverse()
            }, 20000) 
            
        }
    }

    outerFunc()

}

export default erc20Reverse


