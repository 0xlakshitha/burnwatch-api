import dotenv from 'dotenv'

dotenv.config()

export default {
    HOST: process.env.SHIBATRACK_HOST,
    USER: process.env.SHIBATRACK_U,
    PASSWORD: process.env.SHIBATRACK_P,
    DB: process.env.SHIBATRACK_DB,
    dialect: 'mysql'
 }