import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";

export class V5AppsyncLambdaDynamodbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Creates the AppSync API
    const api = new appsync.GraphqlApi(this, "MyDBApi", {
      name: "cdk-appsync-dynamodb-api",
      schema: appsync.Schema.fromAsset("schema/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
    });

    // lambda function
    const lambda_function = new lambda.Function(this, "DynamoDBLambda", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda"),
    });

    // Set the new Lambda function as a data source for the AppSync API
    const lambda_dataSource = api.addLambdaDataSource(
      "lambdaDataSource",
      lambda_function
    );

    // graphql Query resolvers
    lambda_dataSource.createResolver({
      typeName: "Query",
      fieldName: "welcome",
    });

    // graphql Mutation resolvers
    lambda_dataSource.createResolver({
      typeName: "Mutation",
      fieldName: "addProduct",
    });

    // Creating DynamoDB table
    const productTable = new ddb.Table(this, "ProductTable", {
      tableName: "Products",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    // enable the Lambda function to access the DynamoDB table (using IAM)
    productTable.grantFullAccess(lambda_function);

    // Create an environment variable that we will use in the function code
    lambda_function.addEnvironment("TABLE_NAME", productTable.tableName);
  }
}
