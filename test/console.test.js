const { expect } = require('chai');
const sinon = require('sinon');

require('../src/console');
const emojis = require('../src/lib/emojis');

describe('#console', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  describe('Existing emoji', () => {
    beforeEach(() => {
      console.beer('Have a pint');
    });

    it('should create console.beer', () => {
      expect(console).to.haveOwnProperty('beer');
      expect(console.beer).to.be.instanceOf(Function);
    });

    it('should call console log with beer emoji', () => {
      expect(console.log.calledWith(emojis.beer, 'Have a pint')).to.be.true;
    });
  });

  describe('Non-existing emoji', () => {
    const logMessage = () => console.unavailableEmoji('Some log message');

    it('should not create console.unavailableEmoji', () => {
      try { logMessage() } catch(err) {}
      expect(console).to.not.haveOwnProperty('unavailableEmoji');
    });

    it('should throw TypeError exception', () => {
      expect(logMessage).to.throw(TypeError);
    });
  });
});
