//!++++++++++++++++++++++++++++++++++++++++++++
// | Just a sample space to try out concurrent
// | requests in nodejs 
//++++++++++++++++++++++++++++++++++++++++++++

(

    async () => {
        const request = require("request")
        async function Client(url, timeout_mil_seconds, method, data = {}, more_headers = { "Content-Type": "application/json" }) {
            return new Promise((resolve, reject) => {
                const option = {
                    url,
                    method,
                    timeout: timeout_mil_seconds, // in mil secs
                    headers: {
                        ...more_headers
                    },
                    json: true,
                    body: {
                        ...data
                    }

                }
                request(option, (error, response, body) => {

                    if (error) {
                        return reject(error)
                    }
                    console.log('\x1b[41m%s\x1b[0m', 'status code', response.statusCode)
                    resolve(body)
                })


            })
            ///return "one"
        }
        async function Two(url, timeout_mil_seconds) {
            const res = await Client(url, timeout_mil_seconds)
            return res
            // return "two"
            //throw new Error("error")
        }

        // use case: i have 2 endpoints
        const url_1 = "https://exchanger-api.fuspay.finance/"
        const url_2 = "http://prod-order-exchanger-api.fuspay.finance/"
        const url = "https://webhook.site/18c12907-8039-4529-9dea-eed2bca56169"
        const list = [Client(url, timeout = 10000), Two(url, timeout = 2)]

        //  lets make a concurrent get request to the two endpoint at thesame time
        // | we will also add a timeout incase if any of the endpoints does not
        // | respond after a particular time
        try {

            // const responses = await Promise.any([One(), Two()])
            const responses = await Promise.allSettled(list)
            console.log('\x1b[41m%s\x1b[0m', '## test', responses)

        } catch (ex) {

            console.log("error happened", ex)

        }





    }




)()
