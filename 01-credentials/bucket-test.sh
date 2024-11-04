aws s3api create-bucket --bucket hello-vinnyslins
aws s3 cp hello.txt s3://hello-vinnyslins/hello.txt

aws s3 rm s3://hello-vinnyslins --recursive
aws s3api delete-bucket --bucket hello-vinnyslins
