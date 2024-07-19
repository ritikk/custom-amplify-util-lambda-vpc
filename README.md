# custom-amplify-util-lambda-vpc

An Amplify CLI plugin that adds VPC configuration and permissions to all Lambda functions in an Amplify backend.

## Installation

```
npm i -g @ritikk/custom-amplify-util-lambda-vpc

amplify plugin add @ritikk/custom-amplify-util-lambda-vpc
```

## Usage
`amplify custom-amplify-util-lambda-vpc update --file <file_path>`

File path must point to a .json file with configuration information about your VPC and permissions you'd like to add to the lambda execution policy. E.g.:
```
{
    "VpcConfig": {
        "SecurityGroupIds": [
            "sg-1234"
        ],
        "SubnetIds": [
            "subnet-abcd",
            "subnet-efgh"
        ]
    },
    "ExecutionPolicyStatement": {
        "Effect": "Allow",
        "Action": [
            "ec2:CreateNetworkInterface",
            "ec2:DescribeNetworkInterfaces",
            "ec2:DeleteNetworkInterface"
        ],
        "Resource": "*"
    }
}
```

### Commands
- `amplify custom-amplify-util-lambda-vpc help`
- `amplify custom-amplify-util-lambda-vpc version`
- `amplify custom-amplify-util-lambda-vpc update --file <file_path>`


