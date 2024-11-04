npm i -g serverless@3.16

# create serverless project
sls

# deploy serverless project
sls deploy

# show serverless project info
sls info

# invoke a serverless local function
sls invoke local -f api

# invoke a serverless production function
sls invoke -f api

# show logs of a production function
sls logs -f api

# remove serverless project
sls remove
