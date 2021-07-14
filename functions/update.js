const axios = require('axios');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const autopilotSid = process.env.AUTOPILOT_SID;
const client = require('twilio')(accountSid, authToken);

module.exports = {
    item: async(input) => {
        console.log("Update")
        try {
            if (input.collection == "task") {
                input.item.forEach(async(el) => {
                    let task = await axios.get(`http://localhost:8055/items/task/${el}`);
                    task = task.data.data
                    client.autopilot.assistants(autopilotSid)
                        .tasks(task.sid)
                        .update({
                            actions: {
                                actions: [{
                                    say: input.payload.reply
                                }]
                            }
                        })
                        .then(task => console.log(task));
                });
            }
            if (input.collection == "sample") {
                input.item.forEach(async(el) => {
                    let sample = await axios.get(`http://localhost:8055/items/sample/${el}`);
                    sample = sample.data.data
                    let task = await axios.get(`http://localhost:8055/items/task/${sample.task}`);
                    task = task.data.data
                    client.autopilot.assistants(autopilotSid)
                        .tasks(task.sid)
                        .samples(sample.sid)
                        .update({ taggedText: input.payload.sample })
                        .then(sample => console.log(sample));
                });
            }
        } catch (err) {
            console.log(err)
        }
    }
}