class Price {
  constructor(value, currency = 'USD') {
    this.value = this.validate(value);
    this.currency = currency;
  }

  validate(price) {
    if (typeof price !== 'number' || price < 0) {
      throw new Error('Price must be a non-negative number');
    }

    // Round to 2 decimal places
    return Math.round(price * 100) / 100;
  }

  getValue() {
    return this.value;
  }

  getCurrency() {
    return this.currency;
  }

  add(other) {
    if (!(other instanceof Price)) {
      throw new Error('Can only add Price objects');
    }
    if (this.currency !== other.currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return new Price(this.value + other.value, this.currency);
  }

  subtract(other) {
    if (!(other instanceof Price)) {
      throw new Error('Can only subtract Price objects');
    }
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract prices with different currencies');
    }
    return new Price(this.value - other.value, this.currency);
  }

  multiply(multiplier) {
    if (typeof multiplier !== 'number' || multiplier < 0) {
      throw new Error('Multiplier must be a non-negative number');
    }
    return new Price(this.value * multiplier, this.currency);
  }

  equals(other) {
    return other instanceof Price && 
           this.value === other.value && 
           this.currency === other.currency;
  }

  isGreaterThan(other) {
    if (!(other instanceof Price)) {
      throw new Error('Can only compare with Price objects');
    }
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare prices with different currencies');
    }
    return this.value > other.value;
  }

  isLessThan(other) {
    if (!(other instanceof Price)) {
      throw new Error('Can only compare with Price objects');
    }
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare prices with different currencies');
    }
    return this.value < other.value;
  }

  format() {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    });
    return formatter.format(this.value);
  }

  toString() {
    return this.format();
  }

  toJSON() {
    return {
      value: this.value,
      currency: this.currency,
      formatted: this.format()
    };
  }
}

module.exports = { Price };