import dbConfig from '../config/dbConfig.js'
import dreamhostConfig from '../config/dreamhostConfig.js'
import logger from '../config/logger.js'

import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, 
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        logging: false,
        pool: {
            max: 30,
            min: 0,
            idle: 10000,
            acquire: 600000
        }
    }
)

const sequelizedh = new Sequelize(
    dreamhostConfig.DB,
    dreamhostConfig.USER,
    dreamhostConfig.PASSWORD, 
    {
        host: dreamhostConfig.HOST,
        dialect: dreamhostConfig.dialect,
        logging: false,
        pool: {
            max: 30,
            min: 0,
            idle: 10000,
            acquire: 600000
        }
    }
)


sequelize.authenticate()
    .then(() => logger.info('Connection has been established successfully.'))
    .catch((error) => logger.error('Unable to connect to the database:', error))

sequelizedh.authenticate()
    .then(() => logger.info('Dreamhost Connection has been established successfully.'))
    .catch((error) => logger.error('Unable to connect to the database:', error))

export const db = {}
export const dreamhostDB = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

dreamhostDB.Sequelize = Sequelize
dreamhostDB.sequelize = sequelizedh

import addressModel from './addressModel.js'
import tokenModel from './tokenModel.js'
import symbolModel from './symbolModel.js'
import McwCoin from './mcwCoins.js'
import burnModel from './burnModel.js'

db.addressTbl = addressModel(sequelize, DataTypes)
db.tokenTbl = tokenModel(sequelize, DataTypes)
db.symbolTbl = symbolModel(sequelize, DataTypes)
db.mcwCoin = McwCoin(sequelize, DataTypes)
db.burnSum = burnModel(sequelize, DataTypes)

dreamhostDB.mcwCoin = McwCoin(sequelizedh, DataTypes)
dreamhostDB.burnSum = burnModel(sequelizedh, DataTypes)


db.sequelize.sync({ force: false })
    .then(() => logger.info("All models were synchronized successfully."))
    .catch(err => logger.error(err))

dreamhostDB.sequelize.sync({ force: false })
    .then(() => logger.info("All dreamhost models were synchronized successfully."))
    .catch(err => logger.error(err))

// export default {
//     db,
//     dreamhostDB
// }
