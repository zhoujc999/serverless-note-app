import util from "util";
import AWS from "aws-sdk";

let logs;

// Log AWS SDK calls
AWS.config.logger = { log: debug };

const debug = (...args) => {
  logs.push({
    date: new Date(),
    string: util.format(...args),
  });
};

export const init = (event, context) => {
  logs = [];

  // Log API event
  debug("API event", {
    body: event.body,
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
  });
};

export const flush = (e) => {
  logs.forEach(({ date, string }) => console.debug(date, string));
  console.error(e);
};

export default debug;
