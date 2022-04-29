const { create } = require("./functions/create.js");
const { delet } = require("./functions/delete.js");
const { update } = require("./functions/update.js");
const { train } = require("./functions/train.js");
require("dotenv").config();

module.exports = ({ filter, action }, { exceptions }) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    action("items.create", async(input) => {
        await create(input);
        return input;
    });

    filter("items.delete", async(keys, input) => {
        let del = await delet(keys, input);
        let m = await train();
        await delay(2000);
        return input;
    });

    action("items.update", async(input) => {
        let m = await train();
        let r = await update(input);
        return input;
    });
};