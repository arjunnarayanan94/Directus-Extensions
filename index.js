const create = require('./functions/create')
const update = require('./functions/update')
const delet = require('./functions/delete')
const model = require('./functions/model')

module.exports = function registerHook() {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    return {
        'items.create': async(input) => {
            await create.item(input)
            return input
        },
        'items.update': async(input) => {
            let r = await update.item(input)
            let m = await model.train()
            return input
        },
        'items.delete.before': async(input) => {
            let r = await delet.item(input)
            let m = await model.train()
            await delay(2000)
            return input
        },
    }
};