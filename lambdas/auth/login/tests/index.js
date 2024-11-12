const { handler } = require('../index');
async function test() {
    const event = {
        body: JSON.stringify({
            username: 'Ester2819',
            password: 'Jose1308'
        })
    };
    const context = {
        awsRequestId: "1"
    };
    const result = await handler(event, context);
    console.log(">>>", result);
}
test();