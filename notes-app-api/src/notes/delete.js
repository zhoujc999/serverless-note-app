import { handler } from "../libs/handler";
import { remove as dynamoDbDelete } from "../libs/dynamodb";
import { NO_CONTENT } from "http-status-codes";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  await dynamoDbDelete(params);

  return {
    statusCode: NO_CONTENT,
    body: null
  };
});
