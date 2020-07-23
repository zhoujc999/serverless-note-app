import AWS from "aws-sdk";

export const dynamoDBGet = (params) => {
  const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
  dynamoDBClient.get(params).promise();
};

export const dynamoDBPut = (params) => {
  const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
  dynamoDBClient.put(params).promise();
};

export const dynamoDBQuery = (params) => {
  const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
  dynamoDBClient.query(params).promise();
};

export const dynamoDBUpdate = (params) => {
  const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
  dynamoDBClient.update(params).promise();
};

export const dynamoDBDelete = (params) => {
  const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
  dynamoDBClient.delete(params).promise();
};
