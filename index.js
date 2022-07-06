const { create } = require("./functions/create.js");
const { delet } = require("./functions/delete.js");
const { update } = require("./functions/update.js");
const { train } = require("./functions/train.js");
require("dotenv").config();

module.exports = ({ filter, action }, { exceptions }) => {
    const { InvalidPayloadException } = exceptions;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    filter("task.items.create", async(input) => {
        input.collection = "task";
        await create(input)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                throw new InvalidPayloadException(err);
            });
    });

    filter("sample.items.create", async(input) => {
        input.collection = "sample";
        await create(input)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                throw new InvalidPayloadException(err);
            });
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