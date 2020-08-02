import { handler } from "../libs/handler";
import { dynamoDBDelete } from "../libs/dynamoDB";
import { NO_CONTENT } from "http-status-codes";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.STAGE + "-" + process.env.TABLE_NAME,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  await dynamoDBDelete(params);

  return {
    statusCode: NO_CONTENT,
    body: null
  };
});
