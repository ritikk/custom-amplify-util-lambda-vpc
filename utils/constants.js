const EXAMPLE_VPC_CONFIG = {
    "VpcConfig": {
        "SecurityGroupIds": [
            "sg-085912345678492fb"
        ],
        "SubnetIds": [
            "subnet-071f712345678e7c8",
            "subnet-07fd123456788a036"
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

const EXECUTION_POLICY_TEMPLATE = {
    "Type": "AWS::IAM::Policy",
    "Properties": {
        "PolicyName": "lambda-execution-policy-custom-vpc",
        "Roles": [
            {
                "Ref": "LambdaExecutionRole"
            }
        ],
        "PolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [

            ]
        }
    }
}

module.exports = {
    EXAMPLE_VPC_CONFIG,
    EXECUTION_POLICY_TEMPLATE
}