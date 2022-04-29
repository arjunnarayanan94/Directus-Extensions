var axios = require("axios");

module.exports = {
    patch: async(type, key, sid) => {
        var data = JSON.stringify({
            sid: sid,
        });

        var config = {
            method: "patch",
            url: `${process.env.DIRECTUS}/items/${type}/${key}`,
            headers: {
                Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`,
                "Content-Type": "application/json",
            },
            data: data,
        };

        axios(config)
            .then(function(response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function(error) {
                console.log(error);
            });
    },

    get: async(type, key) => {
        return new Promise((resolve, reject) => {
            var config = {
                method: "get",
                url: `${process.env.DIRECTUS}/items/${type}/${key}`,
                headers: {
                    Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`,
                },
            };

            axios(config)
                .then(function(response) {
                    resolve(response.data.data);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    },
};