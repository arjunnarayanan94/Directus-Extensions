const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const autopilotSid = process.env.AUTOPILOT_SID;
const client = require("twilio")(accountSid, authToken);

module.exports = {
    train: async() => {
        console.log("Train ", input);
        client.autopilot
            .assistants(autopilotSid)
            .modelBuilds.create()
            .then((model_build) => console.log(model_build));
    },
};