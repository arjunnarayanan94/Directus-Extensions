const { get } = require("../directus/api");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const autopilotSid = process.env.AUTOPILOT_SID;
const client = require("twilio")(accountSid, authToken);

module.exports = {
    update: async(input) => {
        console.log("Update ", input);
        return new Promise(async(reject) => {
            try {
                if (input.collection.toLowerCase() == "task") {
                    input.keys.forEach(async(el) => {
                        let task = await get("task", el);
                        client.autopilot
                            .assistants(autopilotSid)
                            .tasks(task.sid)
                            .update({
                                uniqueName: input.payload.title,
                                friendlyName: input.payload.title,
                                actions: {
                                    actions: [{
                                        say: input.payload.reply,
                                    }, ],
                                },
                            })
                            .then((task) => console.log("last task=", task))
                            .catch((err) => {
                                reject(err);
                            });
                    });
                } else if (input.collection.toLowerCase() == "sample") {
                    input.keys.forEach(async(el) => {
                        let sample = await get("sample", el);
                        let task = await get("task", sample.task);
                        client.autopilot
                            .assistants(autopilotSid)
                            .tasks(task.sid)
                            .samples(sample.sid)
                            .update({ language: "en-US", taggedText: sample.sample })
                            .then((sample) => console.log(sample))
                            .catch((err) => {
                                reject(err);
                            });
                    });
                }
            } catch (err) {
                console.log(err);
            }
        });
    },
};