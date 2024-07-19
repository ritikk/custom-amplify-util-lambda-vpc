function validateVpcConfig(jsonObj) {
    // Check if the input is a valid JSON object
    if (typeof jsonObj !== 'object' || jsonObj === null) {
        return false;
    }

    // Check if the "VpcConfig" property exists
    if (!jsonObj.hasOwnProperty('VpcConfig')) {
        return false;
    }

    const vpcConfig = jsonObj.VpcConfig;

    // Check if the SecurityGroupIds property exists and is an array
    if (!Array.isArray(vpcConfig.SecurityGroupIds) || vpcConfig.SecurityGroupIds.length < 1) {
        return false;
    }

    // Check if the SubnetIds property exists and is an array
    if (!Array.isArray(vpcConfig.SubnetIds) || vpcConfig.SubnetIds.length < 1) {
        return false;
    }

    // If all checks pass, return true
    return true;
}

function validateExecutionPolicyStatement(jsonObj) {
    // Check if the input is a valid JSON object
    if (typeof jsonObj !== 'object' || jsonObj === null) {
        return false;
    }

    // Check if the "ExecutionPolicyStatement" property exists
    if (!jsonObj.hasOwnProperty('ExecutionPolicyStatement')) {
        return false;
    }

    const policyStatement = jsonObj.ExecutionPolicyStatement;

    // Check if the "Effect" property exists and is a string
    if (!policyStatement.hasOwnProperty('Effect') || typeof policyStatement.Effect !== 'string') {
        return false;
    }

    // Check if the "Action" property exists and is a string or an array of strings
    if (!policyStatement.hasOwnProperty('Action') || (!Array.isArray(policyStatement.Action) && typeof policyStatement.Action !== 'string')) {
        return false;
    }

    // Check if the "Resource" property exists and is a string or an array of strings
    if (!policyStatement.hasOwnProperty('Resource') || (typeof policyStatement.Resource !== 'string' && !Array.isArray(policyStatement.Resource))) {
        return false;
    }

    // If all checks pass, return true
    return true;
}

module.exports = {
    validateVpcConfig,
    validateExecutionPolicyStatement
};