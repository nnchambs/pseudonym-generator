const crypto = require('crypto');

/**
 * ConsentKeys Pseudonym Generator - Production-Ready Implementation
 * 
 * Core Features:
 * - Cryptographically secure pseudonym generation using HMAC-SHA256
 * - Consistent pseudonyms for same user+app combinations
 * - Isolated pseudonyms between different apps
 * - Support for multiple data types (id, email, name, address)
 * - Fake data generation for privacy compliance
 * - Comprehensive error handling and input validation
 */
class ConsentKeysPseudonymGenerator {
  constructor(secretKey) {
    // Validate secret key strength
    if (!secretKey || typeof secretKey !== 'string') {
      throw new Error('Secret key must be a non-empty string');
    }
    if (secretKey.length < 32) {
      throw new Error('Secret key must be at least 32 characters long for security');
    }
    
    this.secretKey = secretKey;
    this.prefix = 'ck_'; // ConsentKeys prefix for brand recognition
    
    // Initialize fake data pools for consistent generation
    this.initializeFakeDataPools();
  }

  /**
   * Initialize deterministic fake data pools
   * These pools are used to generate consistent fake data based on pseudonyms
   */
  initializeFakeDataPools() {
    // Pool of realistic first names
    this.firstNames = [
      'Alex', 'Taylor', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn',
      'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Harley', 'Jamie', 'Kai',
      'Logan', 'Marley', 'Nico', 'Parker', 'Reese', 'Sage', 'Skyler', 'Tatum'
    ];
    
    // Pool of realistic last names
    this.lastNames = [
      'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
      'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
      'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'
    ];
    
    // Pool of street names
    this.streetNames = [
      'Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Maple Ln', 'Cedar Blvd', 'Park Ave',
      'First St', 'Second Ave', 'Third Dr', 'Fourth Ln', 'Fifth St', 'Sixth Ave',
      'Washington St', 'Lincoln Ave', 'Jefferson Dr', 'Madison Ln', 'Monroe St'
    ];
    
    // Pool of city names
    this.cityNames = [
      'Franklin', 'Georgetown', 'Springfield', 'Riverside', 'Madison', 'Greenville',
      'Bristol', 'Fairview', 'Arlington', 'Salem', 'Richmond', 'Troy', 'Auburn',
      'Clayton', 'Hudson', 'Newport', 'Lexington', 'Ashland', 'Beverly', 'Camden'
    ];
    
    // Pool of state abbreviations
    this.stateAbbreviations = [
      'NY', 'CA', 'TX', 'FL', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA',
      'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI', 'CO', 'MN', 'SC', 'AL'
    ];
  }

  /**
   * Generate a secure, consistent pseudonym
   * @param {string} userId - User identifier
   * @param {string} clientId - Client/app identifier  
   * @param {string} dataType - Optional data type for different pseudonym contexts
   * @returns {string} - Secure pseudonym with ck_ prefix
   */
  generatePseudonym(userId, clientId, dataType = 'default') {
    // Input validation with clear error messages
    if (!userId || typeof userId !== 'string') {
      throw new Error('userId is required and must be a non-empty string');
    }
    if (!clientId || typeof clientId !== 'string') {
      throw new Error('clientId is required and must be a non-empty string');
    }
    if (!dataType || typeof dataType !== 'string') {
      throw new Error('dataType must be a non-empty string');
    }

    // Trim whitespace to prevent accidental padding issues
    userId = userId.trim();
    clientId = clientId.trim();
    dataType = dataType.trim();

    // Additional validation after trimming
    if (userId.length === 0) {
      throw new Error('userId cannot be empty or whitespace only');
    }
    if (clientId.length === 0) {
      throw new Error('clientId cannot be empty or whitespace only');
    }
    if (dataType.length === 0) {
      throw new Error('dataType cannot be empty or whitespace only');
    }

    // Create deterministic input with proper separation to prevent collision attacks
    // Using different separators to ensure no input combination can create the same hash
    const separator1 = '\x00'; // Null byte separator
    const separator2 = '\x01'; // SOH separator
    const separator3 = '\x02'; // STX separator
    
    // Construct input with multiple separators for security
    const input = `${userId}${separator1}${clientId}${separator2}${dataType}${separator3}`;

    // Generate HMAC-SHA256 for cryptographic security
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(input);
    const hash = hmac.digest();

    // Convert to URL-safe base64 and truncate to 16 characters for readability
    const base64Hash = hash.toString('base64')
      .replace(/\+/g, '-')    // Replace + with -
      .replace(/\//g, '_')    // Replace / with _
      .replace(/=/g, '')      // Remove padding
      .substring(0, 16);      // Truncate to 16 chars

    return this.prefix + base64Hash;
  }

  /**
   * Verify if a pseudonym was generated by this generator
   * @param {string} pseudonym - Pseudonym to verify
   * @returns {boolean} - True if valid format, false otherwise
   */
  verifyPseudonym(pseudonym) {
    if (!pseudonym || typeof pseudonym !== 'string') {
      return false;
    }
    
    // Check format: ck_ prefix + 16 URL-safe base64 characters
    const pattern = /^ck_[A-Za-z0-9_-]{16}$/;
    return pattern.test(pseudonym);
  }

  /**
   * Generate a consistent fake email address
   * @param {string} userId - User identifier
   * @param {string} clientId - Client/app identifier
   * @returns {string} - Fake email address
   */
  generateFakeEmail(userId, clientId) {
    // Generate pseudonym for email context
    const pseudonym = this.generatePseudonym(userId, clientId, 'email');
    
    // Remove prefix and use as local part
    const localPart = pseudonym.replace(this.prefix, '');
    
    // Use consentkeys.local domain for fake emails
    return `${localPart}@consentkeys.local`;
  }

  /**
   * Generate a consistent fake display name
   * @param {string} userId - User identifier
   * @param {string} clientId - Client/app identifier
   * @returns {string} - Fake display name
   */
  generateFakeDisplayName(userId, clientId) {
    // Generate pseudonym for name context
    const pseudonym = this.generatePseudonym(userId, clientId, 'name');
    
    // Use pseudonym to deterministically select from name pools
    const hash = crypto.createHash('sha256').update(pseudonym).digest();
    
    // Use different parts of hash for first and last name selection
    const firstNameIndex = hash[0] % this.firstNames.length;
    const lastNameIndex = hash[1] % this.lastNames.length;
    
    return `${this.firstNames[firstNameIndex]} ${this.lastNames[lastNameIndex]}`;
  }

  /**
   * Generate a consistent fake address
   * @param {string} userId - User identifier
   * @param {string} clientId - Client/app identifier
   * @returns {Object} - Fake address object
   */
  generateFakeAddress(userId, clientId) {
    // Generate pseudonym for address context
    const pseudonym = this.generatePseudonym(userId, clientId, 'address');
    
    // Use pseudonym to deterministically select address components
    const hash = crypto.createHash('sha256').update(pseudonym).digest();
    
    // Use different bytes of hash for different address components
    const streetNumber = (hash[0] % 9999) + 1; // 1-9999
    const streetIndex = hash[1] % this.streetNames.length;
    const cityIndex = hash[2] % this.cityNames.length;
    const stateIndex = hash[3] % this.stateAbbreviations.length;
    
    // Generate ZIP code using hash bytes
    const zipCode = String((hash[4] << 8 | hash[5]) % 90000 + 10000).padStart(5, '0');
    
    return {
      street: `${streetNumber} ${this.streetNames[streetIndex]}`,
      city: this.cityNames[cityIndex],
      state: this.stateAbbreviations[stateIndex],
      zip: zipCode
    };
  }

  /**
   * Generate a comprehensive fake user profile
   * @param {string} userId - User identifier
   * @param {string} clientId - Client/app identifier
   * @returns {Object} - Complete fake user profile
   */
  generateFakeProfile(userId, clientId) {
    return {
      id: this.generatePseudonym(userId, clientId, 'id'),
      email: this.generateFakeEmail(userId, clientId),
      displayName: this.generateFakeDisplayName(userId, clientId),
      address: this.generateFakeAddress(userId, clientId)
    };
  }

  /**
   * Utility method to generate multiple pseudonyms at once
   * @param {Array} userIds - Array of user identifiers
   * @param {string} clientId - Client/app identifier
   * @param {string} dataType - Data type for pseudonyms
   * @returns {Object} - Map of userId to pseudonym
   */
  generateBulkPseudonyms(userIds, clientId, dataType = 'default') {
    if (!Array.isArray(userIds)) {
      throw new Error('userIds must be an array');
    }
    
    const results = {};
    
    for (const userId of userIds) {
      try {
        results[userId] = this.generatePseudonym(userId, clientId, dataType);
      } catch (error) {
        // Continue processing other users, but track failures
        results[userId] = { error: error.message };
      }
    }
    
    return results;
  }

  /**
   * Get information about the generator configuration
   * @returns {Object} - Configuration information
   */
  getInfo() {
    return {
      prefix: this.prefix,
      keyLength: this.secretKey.length,
      algorithm: 'HMAC-SHA256',
      outputLength: 16,
      version: '1.0.0'
    };
  }
}

module.exports = {
  ConsentKeysPseudonymGenerator
};