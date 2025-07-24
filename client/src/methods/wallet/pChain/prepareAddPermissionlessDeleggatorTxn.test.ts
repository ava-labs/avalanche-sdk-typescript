// import { rest } from 'msw'
// import { getValidUtxo, testAvaxAssetID } from '../fixtures/transactions'

// export const handlers = [
//     rest.post('https://api.avax.network/ext/bc/P', (req, res, ctx) => {
//         if (req.body.method === 'platform.getUTXOs'
//             || req.body.method === 'avm.getUTXOs'
//             || req.body.method === 'avax.getUTXOs') {
//             return res(ctx.json({
//                 result: {
//                     utxos: [
//                         getValidUtxo(50, testAvaxAssetID, [pAddressForTest], 0, 1)
//                     ]
//                 }
//             }))
//         }
//     }
// ]
