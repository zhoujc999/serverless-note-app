import * as HTTPStatusCodes from "http-status-codes";

export default function handler(lambda) {
  return async function (event, context) {
    let statusCode;
    let body;

    try {
      // Run the Lambda
      const result = await lambda(event, context);
      statusCode = result.statusCode;
      body = result.body;
    } catch (err) {
      statusCode = HTTPStatusCodes.INTERNAL_SERVER_ERROR;
      body = { error: err.message };
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": process.env.CORSOrigin,
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
}
