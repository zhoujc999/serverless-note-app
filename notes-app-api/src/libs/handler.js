import { INTERNAL_SERVER_ERROR } from "http-status-codes";

export const handler = (lambda) => {
  return async function (event, context) {
    let statusCode;
    let body;

    try {
      // Run the Lambda
      const result = await lambda(event, context);
      statusCode = result.statusCode;
      body = result.body;
    } catch (err) {
      statusCode = INTERNAL_SERVER_ERROR;
      body = { error: err.message };
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
};
