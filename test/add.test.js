const assert = require('assert');

// add devrait être importée depuis un autre fichier
function add(a, b) {
  return a + b;
}

describe('Test the add function', () => {
  it('add positive values', () => {
    const result1 = add(11, 15);
    assert.strictEqual(result1, 26);
  });

  it('add negative values', () => {
    const result1 = add(-7, -30);
    assert.strictEqual(result1, -37);
  });
});
