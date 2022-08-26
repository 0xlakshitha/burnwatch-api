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

// const sequelize = new Sequelize('mysql://d9p520qzoyvvq8iv:xwyiik6pyzdn09py@r98du2bxwqkq3shg.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/z4khl02j3qejwimd')

sequelize.authenticate()
    .then(() => logger.info('Connection has been established successfully.'))
    .catch((error) => logger.error('Unable to connect to the database:', error))


const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

import addressModel from './addressModel.js'
import tokenModel from './tokenModel.js'

db.addressTbl = addressModel(sequelize, DataTypes)
db.tokenTbl = tokenModel(sequelize, DataTypes)

db.sequelize.sync({ force: false })
    .then(() => logger.info("All models were synchronized successfully."))
    .catch(err => logger.error(err))

export default db