ROLE_NAME=lambda-example
NODEJS_VERSION=nodejs18.x
FUNCTION_NAME=hello-cli

mkdir -p logs

aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document file://policies.json \
  | tee logs/1.role.log

POLICY_ARN=$(jq -r '.Role.Arn' logs/1.role.log)

zip function.zip index.js

aws lambda create-function \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://function.zip \
  --handler index.handler \
  --runtime $NODEJS_VERSION \
  --role $POLICY_ARN \
  | tee logs/2.lambda-create.log

sleep 1

aws lambda update-function-code \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://function.zip \
  --publish \
  | tee logs/3.lambda-update.log

sleep 1

aws lambda invoke \
  --function-name $FUNCTION_NAME logs/4.lambda-invoke.log \
  --log-type Tail \
  --query 'LogResult' \
  --cli-binary-format raw-in-base64-out \
  --payload '{"name": "Vinnys Lins!"}' \
  --output text | base64 -d

aws lambda delete-function \
  --function-name $FUNCTION_NAME

aws iam delete-role \
  --role-name $ROLE_NAME
