const create = require('./functions/create')
const update = require('./functions/update')
const delet = require('./functions/delete')
const model = require('./functions/model')

module.exports = function registerHook() {
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
            console.log("Inside1")
            let m = await model.train()
            console.log("Inside2")
            return input
        },
    }
};