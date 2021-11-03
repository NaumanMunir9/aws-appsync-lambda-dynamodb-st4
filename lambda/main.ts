import { DynamoDB } from "aws-sdk";

const documentClient = new DynamoDB.DocumentClient();

type AppSyncEvent = {
  info: {
    filedName: String;
  };
  arguments: {
    product: Product;
  };
};

type Product = {
  id: String;
  name: String;
  price: Number;
};

export async function handler(event: AppSyncEvent) {
  switch (event.info.filedName) {
    case "welcome":
      return `Hello World!`;
    case "addProduct":
      event.arguments.product.id = `key-${Math.random()}`;
      const params = {
        TableName: process.env.PRODUCTS_TABLE || "",
        Item: event.arguments.product,
      };
      const data = await documentClient.put(params).promise();
      console.log(data);
      return event.arguments.product;
    default:
      return `Not Found!`;
  }
}
