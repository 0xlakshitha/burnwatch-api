// A comparer used to determine if two entries are equal.
export const isSameToken = (a, b) => {
    return a.blockNumber === b.blockNumber && a.timeStamp === b.timeStamp && a.hash === b.hash && a.nonce === b.nonce && a.blockHash === b.blockHash && a.from === b.from && a.contractAddress === b.contractAddress && a.to === b.to && a.value === b.value && a.tokenName === b.tokenName && a.tokenSymbol === b.tokenSymbol && a.tokenDecimal === b.tokenDecimal && a.transactionIndex === b.transactionIndex && a.gas === b.gas
}

export const isSameTxn = (a, b) => {
    return a.blockNumber === b.blockNumber && a.hash === b.hash && a.from === b.from && a.to === b.to
}

// Get items that only occur in the left array,
// using the cb to determine equality.
export const onlyInLeft = (left, right, cb) => (
    left.filter(leftValue => (
        !right.some(rightValue => cb(leftValue, rightValue))
    ))
)