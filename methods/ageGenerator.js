const SECOND = 1000
const MINUTE = 60*1000
const HOUR = 60*MINUTE
const DAY = 24*HOUR
const MONTH = 30*DAY
const YEAR = 365*DAY

export default (timestamp) => {
    const tsNow = Date.now()

    const timeDiff = tsNow - (timestamp * 1000)

    if(timeDiff < SECOND) {
        return '1 second ago'
    }
    else if(timeDiff < MINUTE) {
        const seconds = Math.floor(timeDiff / SECOND)
        return `${seconds} seconds ago`
    }
    else if(timeDiff < HOUR) {
        const minutes = Math.floor(timeDiff / MINUTE)
        return `${minutes} mins ago`
    }
    else if(timeDiff < DAY) {
        const hours = Math.floor(timeDiff / HOUR)
        const mins = Math.floor((timeDiff % HOUR) / MINUTE)
        return `${hours} hrs ${mins} mins ago`
    }
    else {
        const days = Math.floor(timeDiff / DAY)
        const hrs = Math.floor((timeDiff % DAY) / HOUR)
        return `${days} day ${hrs} hrs ago`
    }
}