async function run(context) {
  // print out the help message of your plugin
  printHelp();
}

function printHelp() {
  console.log('Usage: amplify amplify-util-functions-vpc update [options]');
  console.log('Options:');
  console.log('  --file <path>    Path to the VPC config JSON file, required');
}

module.exports = {
  run,
  printHelp
};
