import AWS from "aws-sdk";

const dynamoDBClient = new AWS.DynamoDB.DocumentClient();

export const dynamoDBGet = (params) => dynamoDBClient.get(params).promise();
export const dynamoDBPut = (params) => dynamoDBClient.put(params).promise();
export const dynamoDBQuery = (params) => dynamoDBClient.query(params).promise();
export const dynamoDBUpdate = (params) => dynamoDBClient.update(params).promise();
export const dynamoDBDelete = (params) => dynamoDBClient.delete(params).promise();
