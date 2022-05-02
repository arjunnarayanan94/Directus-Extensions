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
        return new Promise((resolve, reject) => {
            axios(config)
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    },

    get: async(type, key) => {
        var config = {
            method: "get",
            url: `${process.env.DIRECTUS}/items/${type}/${key}`,
            headers: {
                Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`,
            },
        };
        return new Promise((resolve, reject) => {
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