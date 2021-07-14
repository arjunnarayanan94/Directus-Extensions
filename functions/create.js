const axios = require('axios');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const autopilotSid = process.env.AUTOPILOT_SID;
const client = require('twilio')(accountSid, authToken);

module.exports = {
    item: async(input) => {
        console.log("Create")
        try {
            if (input.collection == "task") {
                client.autopilot.assistants(autopilotSid)
                    .tasks
                    .create({
                        friendlyName: input.payload.title,
                        actions: {
                            actions: [{
                                say: input.payload.reply
                            }]
                        },
                        uniqueName: input.payload.title
                    })
                    .then(task => axios.patch(`http://localhost:8055/items/task/${input.item}`, { sid: task.sid }));
            } else if (input.collection == "sample") {
                let task = await axios.get(`http://localhost:8055/items/task/${input.payload.task}`);
                task = task.data.data
                client.autopilot.assistants(autopilotSid)
                    .tasks(task.sid)
                    .samples
                    .create({ language: input.payload.lang, taggedText: input.payload.sample })
                    .then(sample => axios.patch(`http://localhost:8055/items/sample/${input.item}`, { sid: sample.sid }));
            }
        } catch (err) {
            console.log(err)
        }
    }
}