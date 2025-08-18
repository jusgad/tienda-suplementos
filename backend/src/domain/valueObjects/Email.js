class Email {
  constructor(value) {
    this.value = this.validate(value);
  }

  validate(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    return email.toLowerCase().trim();
  }

  getValue() {
    return this.value;
  }

  getDomain() {
    return this.value.split('@')[1];
  }

  getLocalPart() {
    return this.value.split('@')[0];
  }

  equals(other) {
    return other instanceof Email && this.value === other.value;
  }

  toString() {
    return this.value;
  }
}

module.exports = { Email };