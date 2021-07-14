const axios = require('axios');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const autopilotSid = process.env.AUTOPILOT_SID;
const client = require('twilio')(accountSid, authToken);

module.exports = {
    item: async(input) => {
        console.log("Delete")
        try {
            if (input.collection == "task") {
                input.item.forEach(async(el) => {
                    let task = await axios.get(`http://localhost:8055/items/task/${el}`);
                    task = task.data.data
                    client.autopilot.assistants(autopilotSid)
                        .tasks(task.sid)
                        .remove();
                })
            } else if (input.collection == "sample") {
                input.item.forEach(async(el) => {
                    let sample = await axios.get(`http://localhost:8055/items/sample/${el}`);
                    sample = sample.data.data
                    console.log(sample)
                    let task = await axios.get(`http://localhost:8055/items/task/${sample.task}`);
                    task = task.data.data
                    console.log(task)
                    client.autopilot.assistants(autopilotSid)
                        .tasks(task.sid)
                        .samples(sample.sid)
                        .remove();
                })
            }
        } catch (err) {
            console.log(err)
        }
        return input
    }
}