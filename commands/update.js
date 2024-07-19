const help = require('./help');
const jsonHelper = require('../utils/json-file-helper');
const validationHelper = require('../utils/validation-helper');
const constants = require('../utils/constants');

async function findLambdaFunctions(context) {
  const { allResources } = await context.amplify.getResourceStatus();
  const lambdaFunctions =
    allResources.filter((resource) => resource.service === 'Lambda' && resource.mobileHubMigrated !== true);
  if (lambdaFunctions == null || lambdaFunctions.length === 0) {
    throw new Error('No Lambda functions found.');
  }
  return lambdaFunctions;
}

async function readLambdaCfnTemplate(lambdaTemplatePath, context) {
  try {
    const templateData = await jsonHelper.readJSONFile(lambdaTemplatePath);
    return templateData;
  } catch (error) {
    context.print.error(`Error reading file: ${error.message}. Skipping..`);
    return null;
  }
}

async function writeUpdatedCfnTemplate(resourceName, lambdaTemplatePath, templateData, context) {
  try {
    await jsonHelper.writeJSONFile(lambdaTemplatePath, templateData);
    context.print.success(`Lambda function ${resourceName} updated successfully`);
  } catch (error) {
    context.print.error(`Error writing file: ${error.message}`);
  }
}

async function run(context) {

  if (!context.input || !context.input.options || !context.input.options.file) {
    context.print.warning('No config file specified');
    printHelp();
    return;
  }

  const filePath = context.input.options.file + '';
  if (!jsonHelper.isJSONFilePath(filePath)) {
    context.print.warning('Invalid file path');
    printHelp();
    return;
  }

  context.print.info(`Reading file: ${filePath}`);
  const configurationData = await jsonHelper.readJSONFile(filePath);

  context.print.info('Validating file input');
  if (!validationHelper.validateVpcConfig(configurationData) || !validationHelper.validateExecutionPolicyStatement(configurationData)) {
    context.print.error('Invalid config');
    context.print.info('Please check the config file and try again. E.g.:');
    context.print.info(JSON.stringify(constants.EXAMPLE_VPC_CONFIG));
    return;
  }

  const lambdaFunctions = await findLambdaFunctions(context);
  context.print.info('Found Lambda functions: ' + lambdaFunctions.length);

  lambdaFunctions.forEach(async lambda => {
    const resourceName = lambda.resourceName;
    context.print.info(`Updating Lambda function: ${resourceName}`)
    const lambdaTemplatePath = `amplify/backend/function/${resourceName}/${resourceName}-cloudformation-template.json`;
    const templateData = await readLambdaCfnTemplate(lambdaTemplatePath, context);
    if (templateData == null) {
      return;
    }

    // Update the VPC config for the Lambda function
    const lambdaFunction = templateData.Resources.LambdaFunction;
    lambdaFunction.Properties.VpcConfig = configurationData.VpcConfig;

    // Create new execution policy object
    let newPolicy = constants.EXECUTION_POLICY_TEMPLATE;
    newPolicy.Properties.PolicyDocument.Statement.push(configurationData.ExecutionPolicyStatement);
    templateData.Resources['LambdaExecutionPolicyCustomVpc'] = newPolicy;

    // Add execution policy to the template. Looks complicated to maintain idempotency
    if (lambdaFunction.hasOwnProperty('DependsOn')) {
      // if it's already an array
      if (Array.isArray(lambdaFunction.DependsOn)) {
        // check if it's there already
        if (lambdaFunction.DependsOn.indexOf('LambdaExecutionPolicyCustomVpc') > -1) {
          context.print.info(`Lambda function ${resourceName} already has updated execution policy`);
        } else {
          lambdaFunction.DependsOn.push('LambdaExecutionPolicyCustomVpc');
        }
      } else {
        // if it's a string
        if (lambdaFunction.DependsOn === 'LambdaExecutionPolicyCustomVpc') {
          context.print.info(`Lambda function ${resourceName} already has updated execution policy`);
        } else {
          const oldDependency = lambdaFunction.DependsOn + '';
          lambdaFunction.DependsOn = [oldDependency, 'LambdaExecutionPolicyCustomVpc'];
        }
      }
    } else {
      lambdaFunction.DependsOn = ['LambdaExecutionPolicyCustomVpc'];
    }

    await writeUpdatedCfnTemplate(resourceName, lambdaTemplatePath, templateData, context);

  });
}

module.exports = {
  run,
};