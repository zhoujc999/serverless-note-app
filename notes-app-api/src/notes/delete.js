import handler from "../lib/handler";
import dynamoDb from "../lib/dynamodb";
import * as HTTPStatusCodes from "http-status-codes";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  await dynamoDb.delete(params);

  return {
    statusCode: HTTPStatusCodes.NO_CONTENT,
    body: null
  };
});
