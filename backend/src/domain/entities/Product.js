const { Price } = require('../valueObjects/Price');
const { Quantity } = require('../valueObjects/Quantity');

class Product {
  constructor({
    id,
    name,
    description,
    shortDescription,
    price,
    salePrice = null,
    sku,
    categoryId,
    brand,
    stock,
    images = [],
    ingredients = [],
    nutritionalInfo = {},
    specifications = [],
    isActive = true,
    isFeatured = false,
    tags = [],
    weight,
    dimensions = {},
    seoTitle = null,
    seoDescription = null,
    averageRating = 0,
    reviewCount = 0,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.shortDescription = shortDescription;
    this.price = new Price(price);
    this.salePrice = salePrice ? new Price(salePrice) : null;
    this.sku = sku;
    this.categoryId = categoryId;
    this.brand = brand;
    this.stock = new Quantity(stock);
    this.images = images;
    this.ingredients = ingredients;
    this.nutritionalInfo = nutritionalInfo;
    this.specifications = specifications;
    this.isActive = isActive;
    this.isFeatured = isFeatured;
    this.tags = tags;
    this.weight = weight;
    this.dimensions = dimensions;
    this.seoTitle = seoTitle || name;
    this.seoDescription = seoDescription || shortDescription;
    this.averageRating = averageRating;
    this.reviewCount = reviewCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business logic methods
  getCurrentPrice() {
    return this.salePrice && this.salePrice.getValue() < this.price.getValue() 
      ? this.salePrice 
      : this.price;
  }

  isOnSale() {
    return this.salePrice && this.salePrice.getValue() < this.price.getValue();
  }

  isInStock() {
    return this.stock.getValue() > 0;
  }

  canPurchase(quantity) {
    return this.isActive && this.isInStock() && this.stock.getValue() >= quantity;
  }

  reduceStock(quantity) {
    if (!this.canPurchase(quantity)) {
      throw new Error('Insufficient stock or product not available');
    }
    this.stock = new Quantity(this.stock.getValue() - quantity);
    this.updatedAt = new Date();
  }

  addStock(quantity) {
    this.stock = new Quantity(this.stock.getValue() + quantity);
    this.updatedAt = new Date();
  }

  updateRating(newRating) {
    // Simplified rating calculation
    const totalRating = (this.averageRating * this.reviewCount) + newRating;
    this.reviewCount += 1;
    this.averageRating = totalRating / this.reviewCount;
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

  setFeatured(featured = true) {
    this.isFeatured = featured;
    this.updatedAt = new Date();
  }

  update(data) {
    const allowedFields = [
      'name', 'description', 'shortDescription', 'price', 'salePrice',
      'brand', 'stock', 'images', 'ingredients', 'nutritionalInfo',
      'specifications', 'tags', 'weight', 'dimensions', 'seoTitle', 'seoDescription'
    ];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        if (field === 'price') {
          this.price = new Price(data[field]);
        } else if (field === 'salePrice') {
          this.salePrice = data[field] ? new Price(data[field]) : null;
        } else if (field === 'stock') {
          this.stock = new Quantity(data[field]);
        } else {
          this[field] = data[field];
        }
      }
    });

    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      shortDescription: this.shortDescription,
      price: this.price.getValue(),
      salePrice: this.salePrice ? this.salePrice.getValue() : null,
      currentPrice: this.getCurrentPrice().getValue(),
      sku: this.sku,
      categoryId: this.categoryId,
      brand: this.brand,
      stock: this.stock.getValue(),
      images: this.images,
      ingredients: this.ingredients,
      nutritionalInfo: this.nutritionalInfo,
      specifications: this.specifications,
      isActive: this.isActive,
      isFeatured: this.isFeatured,
      isOnSale: this.isOnSale(),
      isInStock: this.isInStock(),
      tags: this.tags,
      weight: this.weight,
      dimensions: this.dimensions,
      seoTitle: this.seoTitle,
      seoDescription: this.seoDescription,
      averageRating: this.averageRating,
      reviewCount: this.reviewCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = { Product };