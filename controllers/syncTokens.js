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

dotenv.config()

const apikey = process.env.API_KEY

let addressQueue = new Queue

const initQueue = async () => {
    const address = await getAllAddr()
    
    address.forEach(addr => {
        addressQueue.enqueue(addr)
    })
}

const syncTokenFunc = async () => {

    await initQueue()

    const outerFunc = async () => {
        const addr = addressQueue.dequeue()

        if(addr) {
            const innerFunc = async (pageNbr = 1, endBlock, initStblock) => {
                let page = pageNbr > 100 ? 1 : pageNbr
                let endblock = endBlock ? endBlock : null
                let initStartBlock = initStblock ? initStblock : false

                let tokens = []

                if(!addr.isSynced) {
                    try {
                        let res
                        if(!endblock) {
                            res = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${addr.address}&page=${page}&offset=100&startblock=0&sort=desc&apikey=${apikey}`)
                        }
                        else {
                            res = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${addr.address}&page=${page}&offset=100&startblock=0&endblock=${endblock}&sort=desc&apikey=${apikey}`)
                        }
    
                        const data = await res.data
                        tokens = data.result
    
                        if(!tokens) {
                            console.log('no results')

                            await updateSyncedState(addr.address)
                            outerFunc()
                            return

                        }else {
                            tokens.forEach(async (token) => {
                                if(parseInt(token.timeStamp) < 1660953600 ) {
                                    updateSyncedState(addr.address)
                                    outerFunc()
                                    return
                                }
                                await addToken(token)
                            });
                        }
                        
                        console.log(page)
    
                        if(page === 1 && addr.startBlock === 0 && addr.lastTimeStamp === 0 && !initStartBlock) {
                            await updateStartBlock(tokens[0].blockNumber, addr.address)
                            await updateTimeStamp(tokens[0].timeStamp, addr.address)
                            initStartBlock = true
                        }
                
                        if(page === 100) {
                            endblock = tokens[tokens.length - 1].blockNumber
                            console.log(endblock)
                        }

                        page++
                        setTimeout(() => {
                            innerFunc(page, endblock, initStartBlock)
                        }, 300)

                    } catch (error) {
                        console.log(error)
                    }
                    

                }
                else {
                    outerFunc()
                    return
                }
            }

            innerFunc()
        } else {
            setTimeout(() => {
                syncTokenFunc()
            }, 20000)
            
        }
    }

    outerFunc()

}

export default syncTokenFunc


