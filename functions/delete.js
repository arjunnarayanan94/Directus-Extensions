const { get } = require("../directus/api");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const autopilotSid = process.env.AUTOPILOT_SID;
const client = require("twilio")(accountSid, authToken);

module.exports = {
    delet: async(keys, input) => {
        console.log("Delete ", input);
        return new Promise(async(resolve, reject) => {
            try {
                if (input.collection.toLowerCase() == "task") {
                    keys.forEach(async(el) => {
                        let task = await get("task", el);
                        client.autopilot
                            .assistants(autopilotSid)
                            .tasks(task.sid)
                            .remove()
                            .then((task) => resolve(task))
                            .catch((err) => {
                                reject(err);
                            });
                    });
                } else if (input.collection.toLowerCase() == "sample") {
                    keys.forEach(async(el) => {
                        let sample = await get("sample", el);
                        let task = await get("task", sample.task);
                        client.autopilot
                            .assistants(autopilotSid)
                            .tasks(task.sid)
                            .samples(sample.sid)
                            .remove()
                            .then((task) => resolve(task))
                            .catch((err) => {
                                reject(err);
                            });
                    });
                } else {
                    resolve(input);
                }
            } catch (err) {
                console.log(err);
            }
        });
    },
};