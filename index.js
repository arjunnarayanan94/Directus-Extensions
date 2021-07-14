const axios = require('axios');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const autopilotSid = process.env.AUTOPILOT_SID;
const client = require('twilio')(accountSid, authToken);

module.exports = function registerHook() {
    let modelTrain = async() => {
        client.autopilot.assistants(autopilotSid)
            .modelBuilds
            .create()
            .then(model_build => console.log(model_build.sid));
    }
    return {
        'items.create': async(input) => {
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
                await modelTrain();
            } catch (err) {
                console.log(err)
            }
            return input
        },
        'items.update': async(input) => {
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
                    await modelTrain();
                }
            } catch (err) {
                console.log(err)
            }
            return input
        },
        'items.delete.before': async(input) => {
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
                        console.log("Inside 1")
                        console.log(sample)
                        let task = await axios.get(`http://localhost:8055/items/task/${sample.task}`);
                        task = task.data.data
                        console.log("Inside 2")
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
        },
    }
};