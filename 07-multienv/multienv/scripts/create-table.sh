aws dynamodb delete-table \
  --no-cli-pager \
  --table-name "CommitMessages-hml" \
  --endpoint-url http://localhost:4566

aws dynamodb create-table \
  --no-cli-pager \
  --table-name "CommitMessages-hml" \
  --endpoint-url http://localhost:4566 \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=commitMessage,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH AttributeName=commitMessage,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

aws dynamodb list-tables \
  --no-cli-pager \
  --endpoint-url http://localhost:4566

aws dynamodb scan \
  --no-cli-pager \
  --endpoint-url http://localhost:4566 \
  --table-name "CommitMessages-hml"
