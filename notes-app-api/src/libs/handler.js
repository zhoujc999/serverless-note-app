import * as debug from "./debug";

export const handler = (lambda) => {
  return async function (event, context) {
    let statusCode;
    let body;

    // Start debugger
    debug.init(event, context);

    context.callbackWaitsForEmptyEventLoop = false;

    try {
      // Run the Lambda
      const result = await lambda(event, context);
      statusCode = result.statusCode;
      body = result.body;
    } catch (err) {
      // Print debug messages
      debug.flush(err);

      statusCode = err.statusCode;
      body = {
        error: err.code,
        message: err.message
       };
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
