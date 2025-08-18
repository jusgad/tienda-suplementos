const bcrypt = require('bcryptjs');
const { Email } = require('../valueObjects/Email');
const { Address } = require('../valueObjects/Address');

class User {
  constructor({
    id,
    email,
    password,
    firstName,
    lastName,
    phone = null,
    role = 'customer',
    isActive = true,
    emailVerified = false,
    profileImage = null,
    address = null,
    preferences = {},
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.email = new Email(email);
    this.password = password; // Should be hashed
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.role = role;
    this.isActive = isActive;
    this.emailVerified = emailVerified;
    this.profileImage = profileImage;
    this.address = address ? new Address(address) : null;
    this.preferences = {
      newsletter: true,
      promotionalEmails: true,
      language: 'en',
      currency: 'USD',
      ...preferences
    };
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business logic methods
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isCustomer() {
    return this.role === 'customer';
  }

  async setPassword(plainPassword) {
    const saltRounds = 12;
    this.password = await bcrypt.hash(plainPassword, saltRounds);
    this.updatedAt = new Date();
  }

  async verifyPassword(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  }

  verifyEmail() {
    this.emailVerified = true;
    this.updatedAt = new Date();
  }

  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  updateProfile(data) {
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'profileImage'
    ];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });

    this.updatedAt = new Date();
  }

  updateAddress(addressData) {
    this.address = new Address(addressData);
    this.updatedAt = new Date();
  }

  updatePreferences(preferences) {
    this.preferences = {
      ...this.preferences,
      ...preferences
    };
    this.updatedAt = new Date();
  }

  promoteToAdmin() {
    this.role = 'admin';
    this.updatedAt = new Date();
  }

  demoteToCustomer() {
    this.role = 'customer';
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email.getValue(),
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.getFullName(),
      phone: this.phone,
      role: this.role,
      isActive: this.isActive,
      emailVerified: this.emailVerified,
      profileImage: this.profileImage,
      address: this.address ? this.address.toJSON() : null,
      preferences: this.preferences,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Return user data without sensitive information
  toPublicJSON() {
    const publicData = this.toJSON();
    delete publicData.password;
    return publicData;
  }
}

module.exports = { User };