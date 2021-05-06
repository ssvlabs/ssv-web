const NodeEnvironment = require('jest-environment-node');
const JSDOMEnvironment = require('jest-environment-uint8array');
const ArrayBufferEnvironment = require('jest-environment-jsdom');

class TestsEnvironments extends NodeEnvironment {
  constructor(config, context) {
    super(config);
    this.config = config;
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setupEnvironments() {
    this.arrayBufferEnvironment = new ArrayBufferEnvironment(this.config);
    this.jsdomEnvironment = new JSDOMEnvironment(this.config);
    await this.arrayBufferEnvironment.setup();
    await this.jsdomEnvironment.setup();
  }

  async setup() {
    await super.setup();
    await this.setupEnvironments();
  }

  async teardown() {
    await super.teardown();
    delete this.jsdomEnvironment;
    delete this.arrayBufferEnvironment;
  }

  runScript(script) {
    super.runScript(script);
  }
}

module.exports = TestsEnvironments;
