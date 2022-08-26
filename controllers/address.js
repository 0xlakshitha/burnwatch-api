import axios from 'axios'
import db from '../models/index.js'
import Redis from 'redis'
import dotenv from 'dotenv'
import logger from '../config/logger.js'
dotenv.config()

const Address = db.addressTbl
const TokenTxn = db.tokenTbl

const redisClient = Redis.createClient()
redisClient.connect()


/* 
===========================================================
=================== GET ALL ADDRESS =======================
===========================================================
*/

export const getAll = async (req, res) => {
    try {
       const addresses = await Address.findAll()
       
       res.status(200).json(addresses)
    } catch (error) {
        logger.error(error)
        res.status(500).json(error)
    }
}


/* 
===========================================================
=================== ADD NEW ADDRESS =======================
===========================================================
*/  

export const addAddress = async (req, res) => {
    const newAddress = req.body
    const apikey = process.env.API_KEY
    try {
        const { data } = await axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${req.body.address}&tag=latest&apikey=${apikey}`)

        if(data.status == 0 || data.result == 0) {
            return res.status(400).json("invalid address")
        }

        const addressExist = await Address.findByPk(req.body.address)

        if(addressExist) {
            return res.status(300).json(`${req.body.address} is already created`)
        }

        const address = await Address.create(newAddress)

        res.status(200).json(address)

    } catch (error) {
        logger.error(error)
        res.status(500).json(error)
    }
}


/* 
===========================================================
=================== PAUSE SYNCING =========================
===========================================================
*/


export const pauseAddress = async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.address)

        if(!address.isActive) {
            return res.status(300).json(`${req.params.address} is already paused`)
        }

        await Address.update({isActive : false}, {
            where: {
                address: req.params.address
            }
        })

        res.status(200).json(`${req.params.address} is paused`)
    } catch (error) {
        logger.error(error)
        res.status(500).json(error)
    }
}


/* 
===========================================================
=================== START SYNCING =========================
===========================================================
*/


export const startAddress = async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.address)

        if(address.isActive) {
            return res.status(300).json(`${req.params.address} is already started`)
        }

        await Address.update({isActive : true}, {
            where: {
                address: req.params.address
            }
        })

        res.status(200).json(`${req.params.address} is started`)
    } catch (error) {
        logger.error(error)
        res.status(500).json(error)
    }
}


/* 
===========================================================
=================== REMOVE ADDRESS ========================
===========================================================
*/


export const removeAddress = async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.address)

        if(!address) {
            return res.status(404).json(`cannot find any record for address: ${req.params.address}`)
        }

        await TokenTxn.destroy({
            where: {
              to: req.params.address
            }
          })

        await Address.destroy({
            where: {
                address: req.params.address
            }
        })

        await redisClient.del(req.params.address)

        res.status(200).json(`${req.params.address} is removed!`)
    } catch (error) {
        logger.error(error)
        res.status(500).json(error)
    }
}