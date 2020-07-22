import { v4 as uuidv4 } from 'uuid';
import handler from "./lib/handler";
import dynamoDb from "./lib/dynamodb";

export const main = handler(async (event, context) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuidv4(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    },
  };

  await dynamoDb.put(params);

  return params.Item;

});
