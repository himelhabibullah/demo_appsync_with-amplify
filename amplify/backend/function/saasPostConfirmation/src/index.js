/* Amplify Params - DO NOT EDIT
	API_SAASSTART_GRAPHQLAPIIDOUTPUT
	API_SAASSTART_MYSUBSCRIPTIONTABLE_ARN
	API_SAASSTART_MYSUBSCRIPTIONTABLE_NAME
	API_SAASSTART_PROFILETABLE_ARN
	API_SAASSTART_PROFILETABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const aws = require("aws-sdk");
var ddb = new aws.DynamoDB();

exports.handler = async (event, context ) => {
  console.log("New event", event);
  if (event.request.userAttributes) {
  let data=  await insertSubscriptionDynamoDB(event)
  console.log("insertSubscriptionDynamoDB", data)
    await insertUserDynamoDB(event);  
  context.done(null, event);
  } else {
    console.log("Error: Nothing was written to DynamoDB");
    context.done(null, event);
  }
};


//Insert MySubscription to DynamoDB
const insertSubscriptionDynamoDB = async (event) => {
  try {
        let date = new Date();
        let item;
        item = {
           __typename: { S: "MySubscription" },
          id: { S: event.request.userAttributes.sub },
          subcription_name: { S: "Free" },
          api_key: { S: "XXX"},
          credit: { N: "10"},
          creation_date: { S: date.toISOString() },
          credit_to_ad_each_month: { S: "10" },
          createdAt: { S: date.toISOString() },
          updatedAt: { S: date.toISOString() },
        };
        let params = {
          Item: item,
          TableName: process.env.API_SAASSTART_MYSUBSCRIPTIONTABLE_NAME,
        };
        console.log("param", params);
        await ddb.putItem(params).promise();
        console.log("DynamoDB Success");
      } catch (err) {
    console.log("Error", err);
  }
};
//Insert user to DynamoDB
const insertUserDynamoDB = async (event) => {
  try {
        let date = new Date();
        let item;
        item = {
           __typename: { S: "Profile" },
          id: { S: event.request.userAttributes.sub },
          owner: { S: event.request.userAttributes.sub },
          email: { S: event.request.userAttributes.email},
          subcriptionID: { S: event.request.userAttributes.sub},
          createdAt: { S: date.toISOString() },
          updatedAt: { S: date.toISOString() },
        };
        let params = {
          Item: item,
          TableName: process.env.API_SAASSTART_PROFILETABLE_NAME,
        };
        console.log("param", params);
        await ddb.putItem(params).promise();
        console.log("DynamoDB Success");
      } catch (err) {
    console.log("Error", err);
  }
};
