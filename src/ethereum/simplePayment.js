import web3 from './web3'
const address = '0x097Ad6F78Bb483fE2D45B19e1560731E9A465547'
const abi = require('./build/SimplePaymentChannel.json')

export default new web3.eth.Contract(abi, address)