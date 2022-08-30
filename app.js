import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import cluster from 'cluster'
import os from 'os'
import compression from 'compression'
import logger from './config/logger.js'

dotenv.config()

const app = express()

const cpuCount = os.cpus().length

app.use(compression())
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

import tokenRouter from './routes/tokensRoute.js'
import addressRouter from './routes/addressRoute.js'

app.use('/api/erc20', tokenRouter)
app.use('/api/address', addressRouter)

import syncERC20 from './controllers/syncERC20.js'

syncERC20()


const port = process.env.PORT || 5000

if(cluster.isPrimary) {
    for(let i = 0; i < cpuCount; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        cluster.fork()
    })
}else {
    app.listen(5000, logger.info(`Server running on port ${port} - pid: ${process.pid}`))
}

// app.listen(5000, logger.info(`Server running on port ${port} - pid: ${process.pid}`))
