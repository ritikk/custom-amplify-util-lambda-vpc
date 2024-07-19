var pjson = require('../package.json');

async function run(context) {
  // print out the version of your plugin package
  context.print.info(pjson.version);
}

module.exports = {
  run,
};
