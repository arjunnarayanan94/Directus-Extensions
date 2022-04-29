const axios = require("axios");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const autopilotSid = process.env.AUTOPILOT_SID;
const client = require("twilio")(accountSid, authToken);

module.exports = {
    delet: async(keys, input) => {
        console.log("Delete ", input);
        return new Promise(async(resolve, reject) => {
            try {
                if (input.collection == "task") {
                    keys.forEach(async(el) => {
                        let task = await axios.get(
                            `${process.env.DIRECTUS}/items/task/${el}`
                        );
                        task = task.data.data;
                        client.autopilot
                            .assistants(autopilotSid)
                            .tasks(task.sid)
                            .remove()
                            .then((task) => resolve(task))
                            .catch((err) => {
                                reject(err);
                            });
                    });
                } else if (input.collection == "sample") {
                    keys.forEach(async(el) => {
                        let sample = await axios.get(
                            `${process.env.DIRECTUS}/items/sample/${el}`
                        );
                        sample = sample.data.data;
                        let task = await axios.get(
                            `${process.env.DIRECTUS}/items/task/${sample.task}`
                        );
                        task = task.data.data;
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
                }
            } catch (err) {
                console.log(err);
            }
            return input;
        });
    },
};