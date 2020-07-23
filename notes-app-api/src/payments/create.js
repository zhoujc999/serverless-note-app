import stripePackage from "stripe";
import { v4 as uuidv4 } from 'uuid';
import { handler } from "../libs/handler";
import {
  CREATED,
  INTERNAL_SERVER_ERROR
} from "http-status-codes";

export const calculateCost = (storage) => {
  const rate = storage <= 10
    ? 4
    : storage <= 100
      ? 2
      : 1;

  return rate * storage * 100;
};

export const main = handler(async (event, context) => {
  const { storage } = JSON.parse(event.body);
  const amount = calculateCost(storage);
  const description = "Scratch charge";

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: process.env.paymentCurrency,
    description: description,
  }, {
    idempotencyKey: uuidv4()
  });

  if (paymentIntent.status !== "requires_payment_method") {
    return {
      statusCode: INTERNAL_SERVER_ERROR,
      body: "Unexpected status: " + paymentIntent.status
    };
  }

  return {
    statusCode: CREATED,
    body: paymentIntent.client_secret
  };
});

