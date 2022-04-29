const axios = require("axios");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const autopilotSid = process.env.AUTOPILOT_SID;
const client = require("twilio")(accountSid, authToken);

module.exports = {
    create: async(input) => {
        console.log("Create ", input);
        return new Promise(async(resolve, reject) => {
            try {
                if (input.collection == "Task") {
                    client.autopilot
                        .assistants(autopilotSid)
                        .tasks.create({
                            friendlyName: input.payload.title,
                            actions: {
                                actions: [{
                                    say: input.payload.reply,
                                }, ],
                            },
                            uniqueName: input.payload.title,
                        })
                        .then((task) => {
                            axios.patch(`${process.env.DIRECTUS}/items/task/${input.key}`, {
                                sid: task.sid,
                            });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else if (input.collection == "Sample") {
                    let task = await axios.get(
                        `${process.env.DIRECTUS}/items/task/${input.payload.task}`
                    );
                    task = task.data.data;
                    client.autopilot
                        .assistants(autopilotSid)
                        .tasks(task.sid)
                        .samples.create({
                            language: "en-US",
                            taggedText: input.payload.sample,
                        })
                        .then((sample) =>
                            axios.patch(
                                `${process.env.DIRECTUS}/items/sample/${input.key}?access_token=${token}`, {
                                    sid: sample.sid,
                                }
                            )
                        )
                        .catch((err) => reject(err));
                }
            } catch (err) {
                console.log(err);
            }
        });
    },
};