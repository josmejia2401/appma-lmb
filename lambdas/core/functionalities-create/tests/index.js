const { handler } = require('../index');
async function test() {
    const event = {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lMyIsImtleWlkIjoiOTBjZjhmMDUtY2Q5Ny00NDkyLWFiYTktNDg2ZDI2ZGE5NDJhIiwiaWF0IjoxNzIxNzU0MjU0LCJleHAiOjE3NTMyOTAyNTQsImF1ZCI6ImFwcG1hIiwiaXNzIjoiZmlyc3ROYW1lIiwic3ViIjoidXNlcm5hbWUzIiwianRpIjoiNTY2OTQxZDktZTMxNi00ZjNlLWJmZTgtNDkzNDE0ZmY5MWI4In0.L7BwzwEMsRUkiaNNSZ57WByhUb8Ztbi3hGylUKjAi78"
        },
        body: JSON.stringify({ "name": "sss", "description": "", "status": 1, "projectId": "116128618240190", "technologies": [{ "id": "1" }, { "id": "2" }], "languages": [{ "id": "2" }, { "id": "3" }] })
    };
    const context = {
        awsRequestId: "1"
    };
    const result = await handler(event, context);
    console.log(">>>", result);
}
test();