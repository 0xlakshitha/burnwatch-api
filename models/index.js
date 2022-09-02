import dbConfig from '../config/dbConfig.js'
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
            acquire: 60000
        }
    }
)


sequelize.authenticate()
    .then(() => logger.info('Connection has been established successfully.'))
    .catch((error) => logger.error('Unable to connect to the database:', error))


const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

import addressModel from './addressModel.js'
import tokenModel from './tokenModel.js'
import symbolModel from './symbolModel.js'

db.addressTbl = addressModel(sequelize, DataTypes)
db.tokenTbl = tokenModel(sequelize, DataTypes)
db.symbolTbl = symbolModel(sequelize, DataTypes)

db.sequelize.sync({ force: false })
    .then(() => logger.info("All models were synchronized successfully."))
    .catch(err => logger.error(err))

export default db