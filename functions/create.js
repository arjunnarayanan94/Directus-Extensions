const {get, patch } = require("../directus/api");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const autopilotSid = process.env.AUTOPILOT_SID;
const client = require("twilio")(accountSid, authToken);

module.exports = {
    create: async(input) => {
        console.log("Create ", input);
        return new Promise(async(resolve, reject) => {
            try {
                if (input.collection.toLowerCase() == "task") {
                    client.autopilot
                        .assistants(autopilotSid)
                        .tasks.create({
                            friendlyName: input.title,
                            actions: input.reply,
                            uniqueName: input.title,
                        })
                        .then((task) => {
                            patch("task", input.key, task.sid);
                            resolve(input);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else if (input.collection.toLowerCase() == "sample") {
                    let task = await get("task", input.task);
                    client.autopilot
                        .assistants(autopilotSid)
                        .tasks(task.sid)
                        .samples.create({
                            language: "en-US",
                            taggedText: input.sample,
                        })
                        .then((sample) => {
                            patch("sample", input.key, sample.sid);
                            resolve(input);
                        })
                        .catch((err) => reject(err));
                }
            } catch (err) {
                reject(err);
            }
        });
    },
};