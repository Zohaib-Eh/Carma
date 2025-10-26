// BigInt serialization polyfill for development
if (typeof BigInt !== 'undefined') {
  // @ts-ignore
  BigInt.prototype.toJSON = function() {
    return this.toString();
  };
}

export {};
