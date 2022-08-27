# BURN WATCH API documentation

#### Contents

- [Overview](#1-overview)
- [Resources](#2-resources)
  - [ERC20 Token](#21-erc20-tokens)
  - [Addresses](#22-publications)
- [Testing](#3-testing)

## 1. Overview
#
BURN WATCH API is a JSON-based API. All requests are made to endpoints beginning:
`http://206.189.196.17/api/`

You can replace this base url with your url.

&nbsp;
## 2. Resources
#
The API is RESTful and arranged around resources.  All requests must be made using `http`.

&nbsp;
### 2.1 ERC20 Token
#
&nbsp;
#### **Getting the list of ERC20 token transactions**
Returns list of the newset erc20 transactions. By default it returns 100 of records.

```
GET http://206.189.196.17/api/erc20/
```

The response is a 100 token transactions within a array


Example response:

```
[
    {
    "age": "35 seconds ago",
    "value": "1000",
    "token": "HEX (HEX)",
    "txnHash": "0x24d388e82cd50c212d749059497e5fe311a364c4ecdcdf3342abe527e9c2b8f0",
    "timeStamp": 1661584582,
    "from": "0x4c89193f3faebb0d364bde1b4ea5ed3bd206e5a4",
    "to": "0x0000000000000000000000000000000000000000",
    "tokenName": "HEX",
    "tokenSymbol": "HEX"
  },
  {
    "age": "35 seconds ago",
    "value": "7.45593",
    "token": "Azure (TATsu)",
    "txnHash": "0xcfeac84a024c609d0cce994574caef2d2902a1f42951aad850e6c078e0080a6e",
    "timeStamp": 1661584582,
    "from": "0xf44697f9fb54e9cdab89167c78d60a4289b5301f",
    "to": "0x000000000000000000000000000000000000dead",
    "tokenName": "Azure",
    "tokenSymbol": "TATsu"
  },
  {
    "age": "35 seconds ago",
    "value": "0.00024",
    "token": "PyroMatic (PYRO)",
    "txnHash": "0x5b0be5c6d3e52e00adf5c2b6180e2dd69b786a38611c6473ebcac5e5bd70c3cf",
    "timeStamp": 1661584582,
    "from": "0x89568569da9c83cb35e59f92f5df2f6ca829eeee",
    "to": "0x0000000000000000000000000000000000000000",
    "tokenName": "PyroMatic",
    "tokenSymbol": "PYRO"
  },
  ....
]
```


Where a token object is:

| Field       | Type    | Description                                     |
| ------------|---------|-------------------------------------------------|
| age         | string  | Age of txn (This field is dynamic)              |
| value       | string  | Transfered value                                |
| token       | string  | Token name and token symbol                     |
| txnHash     | string  | Transaction hash                                |
| timeStamp   | integer | TimeStamp when trnasaction happened             |
| from        | string  | From Address                                    |
| to          | string  | To address                                      |
| tokenName   | string  | Name of of the token                            |
| tokenSymbol | integer | Sybol of the token                              |


&nbsp;

Possible erros:

| Error code           | Description                                     |
| ---------------------|-------------------------------------------------|
| 404                  | No transactions                                 |
| 500                  | Internal Server Error                           |



&nbsp;
#### **Getting the list of ERC20 token transactions with filter options**


Filter options:

| Option             | Description                                        |
| -------------------|----------------------------------------------------|
| page               | Enable pagination. Default page size is 100. You can specify page size with pagesize opiton |
| pagesize           | Specify amount of how many records display for a single page |
| starttime          | Set starting time ( this works with timestamps only ) |
| endtime            | Set ending time ( this works with timestamps only )   |



Example request:

```
GET http://206.189.196.17/api/erc20/?page=6&pagesize=20&starttime=1661587034&endtime=1661587639
```

The response is transactions between Saturday, August 27, 2022 7:57:14 and Saturday, August 27, 2022 8:07:19

&nbsp;

#### **Getting the list of ERC20 token transactions by address**

Returns list of the 100 newset erc20 transactions by address.

```
GET http://206.189.196.17/api/erc20/{{ address }}
```

The response is new trnasactions of the given address.


Example request:

```
GET http://206.189.196.17/api/erc20/0x000000000000000000000000000000000000dead
```

Filter options:

+ We can apply same filter options that discuss in the previous section.
+ Additionally this endpoit have another filter option

| Option             | Description                                        |
| -------------------|----------------------------------------------------|
| token              | Filter by token (add token symbol)                 |



Example request (filter by token):

```
GET http://206.189.196.17/api/erc20/0x000000000000000000000000000000000000dead/?token=AURA
```


Example response:

```
[
  {
    "age": "6 mins ago",
    "value": "50",
    "token": "AURA (AURA)",
    "txnHash": "0xe4a90a3b216cad026afcc5b1677be8f04700ebb59cfc793e3890bcd05f381760",
    "timeStamp": 1661588503,
    "from": "0x5bdd68d6ce84ca1f78cd4d44651b4f567804c530",
    "to": "0x000000000000000000000000000000000000dead",
    "tokenName": "AURA",
    "tokenSymbol": "AURA"
  },
  {
    "age": "4 hrs 43 mins ago",
    "value": "150",
    "token": "AURA (AURA)",
    "txnHash": "0xe95655995e77643bf262524964b154fa8f17f12bcec54875440e73822a9ec395",
    "timeStamp": 1661571877,
    "from": "0x939def73ef2caae224da3f0d233040d3c5e99e98",
    "to": "0x000000000000000000000000000000000000dead",
    "tokenName": "AURA",
    "tokenSymbol": "AURA"
  }
]
```

Example request (with all filter option):

```
GET http://206.189.196.17/api/erc20/0x000000000000000000000000000000000000dead/?token=UNI-V2&starttime=1661584768&endtime=1661585361
```

Example response:

```
[
  {
    "age": "1 hrs 3 mins ago",
    "value": "277488738.5102312",
    "token": "Uniswap V2 (UNI-V2)",
    "txnHash": "0xafda0a69bd74b5aa0d743be0f0bf0a5eb51ee956218d2bb2574cf51da4d93e0c",
    "timeStamp": 1661585361,
    "from": "0xeaf667df82872e702177513131e246872a379b58",
    "to": "0x000000000000000000000000000000000000dead",
    "tokenName": "Uniswap V2",
    "tokenSymbol": "UNI-V2"
  },
  {
    "age": "1 hrs 13 mins ago",
    "value": "1.1159514438622604",
    "token": "Uniswap V2 (UNI-V2)",
    "txnHash": "0xcb307c80aa8488ddec27c233a889e2827c77ce582a36df3df1bd92da02dcb61e",
    "timeStamp": 1661584768,
    "from": "0x0000000000000000000000000000000000000000",
    "to": "0x000000000000000000000000000000000000dead",
    "tokenName": "Uniswap V2",
    "tokenSymbol": "UNI-V2"
  },
  {
    "age": "1 hrs 13 mins ago",
    "value": "487882163.1866589",
    "token": "Uniswap V2 (UNI-V2)",
    "txnHash": "0xcb307c80aa8488ddec27c233a889e2827c77ce582a36df3df1bd92da02dcb61e",
    "timeStamp": 1661584768,
    "from": "0x0000000000000000000000000000000000000000",
    "to": "0x000000000000000000000000000000000000dead",
    "tokenName": "Uniswap V2",
    "tokenSymbol": "UNI-V2"
  }
]
```

&nbsp;

#### **Getting the list of ERC20 token transactions by txn hash**

Returns list (maybe one) of the newset erc20 transactions by txn hash.

```
GET http://206.189.196.17/api/erc20/hash/{{ txn hash }}
```

The response is one or more trnasactions of the given txn hash.

Example request:

```
GET http://206.189.196.17/api/erc20/hash/0xcb307c80aa8488ddec27c233a889e2827c77ce582a36df3df1bd92da02dcb61e/?token=UNI-V2&starttime=1661584768&endtime=1661585361
```

Example response:

```
[
  {
    "age": "1 hrs 20 mins ago",
    "value": "1.1159514438622604",
    "token": "Uniswap V2 (UNI-V2)",
    "txnHash": "0xcb307c80aa8488ddec27c233a889e2827c77ce582a36df3df1bd92da02dcb61e",
    "timeStamp": 1661584768,
    "from": "0x0000000000000000000000000000000000000000",
    "to": "0x000000000000000000000000000000000000dead",
    "tokenName": "Uniswap V2",
    "tokenSymbol": "UNI-V2"
  },
  {
    "age": "1 hrs 20 mins ago",
    "value": "487882163.1866589",
    "token": "Uniswap V2 (UNI-V2)",
    "txnHash": "0xcb307c80aa8488ddec27c233a889e2827c77ce582a36df3df1bd92da02dcb61e",
    "timeStamp": 1661584768,
    "from": "0x0000000000000000000000000000000000000000",
    "to": "0x000000000000000000000000000000000000dead",
    "tokenName": "Uniswap V2",
    "tokenSymbol": "UNI-V2"
  }
]
```

Filter options:

+ No filter options for this endpoint


&nbsp;

#### **Getting the list of ERC20 token transactions by token**

Returns list of the newset erc20 transactions by token.

```
GET http://206.189.196.17/api/erc20/token/{{ token symbol }}
```

The response is one or more trnasactions of the given token symbol.

Example request:

```
GET http://206.189.196.17/api/erc20/token/UNI-V2
```

Example response:

```
[
  {
    "age": "43 seconds ago",
    "value": "26.401400682080173",
    "token": "Uniswap V2 (UNI-V2)",
    "txnHash": "0x1d1ac2592a4555f529d58e10896b7271ff47a6d36b857305f50f4c913c8b9638",
    "timeStamp": 1661590066,
    "from": "0x0000000000000000000000000000000000000000",
    "to": "0x000000000000000000000000000000000000dead",
    "tokenName": "Uniswap V2",
    "tokenSymbol": "UNI-V2"
  },
  {
    "age": "1 mins ago",
    "value": "1484558.486646604",
    "token": "Uniswap V2 (UNI-V2)",
    "txnHash": "0x5e42d933ce6afd58db5ae3e3bdb11e11f15bc749550e9c7dac97968fb01eedb7",
    "timeStamp": 1661590006,
    "from": "0x8aeb25279578d8b211cc75bfb0ded9b2c408f757",
    "to": "0x0000000000000000000000000000000000000000",
    "tokenName": "Uniswap V2",
    "tokenSymbol": "UNI-V2"
  },
  {
    "age": "3 mins ago",
    "value": "1537993.122979821",
    "token": "Uniswap V2 (UNI-V2)",
    "txnHash": "0x56a901d5a236a3f8f3664b3783e2f527cdce93c5c6064005b236ecc92a68b88e",
    "timeStamp": 1661589887,
    "from": "0x8aeb25279578d8b211cc75bfb0ded9b2c408f757",
    "to": "0x0000000000000000000000000000000000000000",
    "tokenName": "Uniswap V2",
    "tokenSymbol": "UNI-V2"
  },
  ...
]
```

Filter options:

+ page
+ pagesize
+ starttime
+ endtime


Example request with filter options:

```
GET http://206.189.196.17/api/erc20/token/UNI-V2/?starttime=1661582914&endtime=1661589804&page=1&pagesize=2
```

Example response:

```
[
  {
    "age": "9 mins ago",
    "value": "1593310.431303778",
    "token": "Uniswap V2 (UNI-V2)",
    "txnHash": "0x34adace9b1e88a90711667bb57f3980a79a295975a95aa045a5fb36697814dfc",
    "timeStamp": 1661589804,
    "from": "0x8aeb25279578d8b211cc75bfb0ded9b2c408f757",
    "to": "0x0000000000000000000000000000000000000000",
    "tokenName": "Uniswap V2",
    "tokenSymbol": "UNI-V2"
  },
  {
    "age": "11 mins ago",
    "value": "1650575.314565885",
    "token": "Uniswap V2 (UNI-V2)",
    "txnHash": "0x49f35d60a22138e7f2ce5ef049b1f12703ef7f77f23d159d346af0415c20b55a",
    "timeStamp": 1661589665,
    "from": "0x8aeb25279578d8b211cc75bfb0ded9b2c408f757",
    "to": "0x0000000000000000000000000000000000000000",
    "tokenName": "Uniswap V2",
    "tokenSymbol": "UNI-V2"
  }
]
```

&nbsp;

#### **Getting the list of ERC20 token transactions by timeStamp**

Returns list of the newset erc20 transactions by timestamp.

```
GET http://206.189.196.17/api/erc20/timestamp/{{ timestamp }}
```

The response is one or more trnasactions occured in the given timeStamp.

Example request:

```
GET http://206.189.196.17/api/erc20/timestamp/1661589804
```

Example response:

```
[
  {
    "age": "13 mins ago",
    "value": "1593310.431303778",
    "token": "Uniswap V2 (UNI-V2)",
    "txnHash": "0x34adace9b1e88a90711667bb57f3980a79a295975a95aa045a5fb36697814dfc",
    "timeStamp": 1661589804,
    "from": "0x8aeb25279578d8b211cc75bfb0ded9b2c408f757",
    "to": "0x0000000000000000000000000000000000000000",
    "tokenName": "Uniswap V2",
    "tokenSymbol": "UNI-V2"
  }
]
```

Filter options:

+ No filter options for this endpoint


&nbsp;
### 2.1 Addresses
#
&nbsp;

#### **Adding a new address to the database**
Returns new address 

```
POST http://206.189.196.17/api/address/
Content-Type: application/json
{
  "address" : "{{ address }}"
}
```

Example request:

```
POST http://206.189.196.17/api/address/
Content-Type: application/json
{
  "address" : "0xf977814e90da44bfa03b6295a0616a897441acec"
}
```

Example response: 
```
{
  "isActive": true,
  "address": "0xf977814e90da44bfa03b6295a0616a897441acec",
  "updatedAt": "2022-08-27T09:12:17.535Z",
  "createdAt": "2022-08-27T09:12:17.535Z"
}
```

Where a address object is:

| Field       | Type    | Description                                     |
| ------------|---------|-------------------------------------------------|
| isActive    | boolean | Address is active or not                        |
| address     | string  | address                                         |
| updatedAt   | string  | Updated date and time                           |
| createdAt   | string  | Created date and time                           |


&nbsp;

Possible erros:

| Error code           | Description                                     |
| ---------------------|-------------------------------------------------|
| 300                  | Address is already added to the database        |
| 400                  | Invalid address                                 |
| 500                  | Internal server error                           |



&nbsp;

#### **Pause the syncing transactions for a one address**
We can Pause the syncing process for a address by deactivatig the address

```
PUT http://206.189.196.17/api/address/pause/{{ address }}
```

Example request:

```
PUT http://206.189.196.17/api/address/pause/0xf977814e90da44bfa03b6295a0616a897441acec
```

Example response:

```
"0xf977814e90da44bfa03b6295a0616a897441acec is paused"
```

Possible erros:

| Error code           | Description                                     |
| ---------------------|-------------------------------------------------|
| 300                  | Address is already paused                       |
| 500                  | Internal server error                           |


&nbsp;
#### **Start the syncing transactions for a one address**
We can start the syncing process for a address by activating the address

```
PUT http://206.189.196.17/api/address/start/{{ address }}
```

Example request:

```
PUT http://206.189.196.17/api/address/start/0xf977814e90da44bfa03b6295a0616a897441acec
```

Example response:

```
"0xf977814e90da44bfa03b6295a0616a897441acec is started"
```

Possible erros:

| Error code           | Description                                     |
| ---------------------|-------------------------------------------------|
| 300                  | Address is already started                      |
| 500                  | Internal server error                           |


&nbsp;
#### **Getting all addresses in the database**
Returns a list of all addresses

Example request:

```
GET http://206.189.196.17/api/address/
```

Example response:

```
[
  {
    "address": "0x0000000000000000000000000000000000000000",
    "isActive": true,
    "createdAt": "2022-08-26T20:34:27.000Z",
    "updatedAt": "2022-08-26T20:34:27.000Z"
  },
  {
    "address": "0x000000000000000000000000000000000000dead"
    "isActive": true,
    "createdAt": "2022-08-26T20:34:55.000Z",
    "updatedAt": "2022-08-26T20:34:55.000Z"
  },
  {
    "address": "0xdead000000000000000042069420694206942069",
    "isActive": true,
    "createdAt": "2022-08-26T20:35:11.000Z",
    "updatedAt": "2022-08-26T20:35:11.000Z"
  },
]
```

&nbsp;
#### **Remove address from database**
We can start the syncing process for a address by activating the address

**! IMPORTANT : This will remove all transactions for the given address**

```
DELETE http://206.189.196.17/api/address/remove/{{ address }}
```

Example request:
```
DELETE http://206.189.196.17/api/address/remove/0xf977814e90da44bfa03b6295a0616a897441acec
```

Example response:

```
"0xf977814e90da44bfa03b6295a0616a897441acec is removed!"
```

Possible erros:

| Error code           | Description                                     |
| ---------------------|-------------------------------------------------|
| 404                  | Cannot find address in the data base            |
| 500                  | Internal server error                           |
