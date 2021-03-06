import { v4 as uuidv4 } from 'uuid';
import { handler } from "../libs/handler";
import { dynamoDBPut } from "../libs/dynamoDB";
import { CREATED } from "http-status-codes";

export const main = handler(async (event, context) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.STAGE + "-" + process.env.TABLE_NAME,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuidv4(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  await dynamoDBPut(params);

  return {
    statusCode: CREATED,
    body: params.Item
  };
});
