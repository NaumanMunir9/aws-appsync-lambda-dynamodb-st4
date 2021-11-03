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
  if (event.info.filedName == "welcome") {
    return `Hello World!`;
  } else if (event.info.filedName == "addProduct") {
    event.arguments.product.id = `key-${Math.random()}`;
    const params = {
      TableName: process.env.TABLE_NAME || "",
      Item: event.arguments.product,
    };
    const data = await documentClient.put(params).promise();
    console.log(`After Adding ${data}`);
    return event.arguments.product;
  } else {
    return `Not Found!`;
  }
}
