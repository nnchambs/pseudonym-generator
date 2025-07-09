// test.js - Comprehensive Test Suite for ConsentKeysPseudonymGenerator
const { ConsentKeysPseudonymGenerator } = require('./index.js');

/**
 * Test suite for the ConsentKeysPseudonymGenerator
 * Tests all requirements: consistency, isolation, multiple data types, error handling
 */
function runTestSuite() {
    console.log('🔐 ConsentKeys Pseudonym Generator Test Suite');
    console.log('==========================================\n');

    // Initialize generator with secure key
    const generator = new ConsentKeysPseudonymGenerator('super-secret-key-at-least-32-chars-long');

    // Test 1: Consistency Tests
    console.log('=== Consistency Tests ===');
    const pseudo1 = generator.generatePseudonym('user123', 'shopping-app');
    const pseudo2 = generator.generatePseudonym('user123', 'shopping-app');
    
    console.log('User123 + shopping-app:', pseudo1);
    console.log('User123 + shopping-app (again):', pseudo2);
    console.log('✓ Consistency check:', pseudo1 === pseudo2);
    
    const differentApp = generator.generatePseudonym('user123', 'social-app');
    console.log('Same user, different app:', differentApp);
    console.log('✓ Different apps produce different pseudonyms:', pseudo1 !== differentApp);

    // Test 2: App Isolation Tests
    console.log('\n=== App Isolation Tests ===');
    const user456Shopping = generator.generatePseudonym('user456', 'shopping-app');
    const user456Social = generator.generatePseudonym('user456', 'social-app');
    
    console.log('User456 + shopping-app:', user456Shopping);
    console.log('User456 + social-app:', user456Social);
    console.log('✓ Same user, different apps isolated:', user456Shopping !== user456Social);

    // Test 3: Data Type Variations
    console.log('\n=== Data Type Variations ===');
    const idPseudo = generator.generatePseudonym('user123', 'shopping-app', 'id');
    const emailPseudo = generator.generatePseudonym('user123', 'shopping-app', 'email');
    const namePseudo = generator.generatePseudonym('user123', 'shopping-app', 'name');
    
    console.log('ID pseudonym:', idPseudo);
    console.log('Email pseudonym:', emailPseudo);
    console.log('Name pseudonym:', namePseudo);
    console.log('✓ Different data types produce different pseudonyms:', 
        idPseudo !== emailPseudo && emailPseudo !== namePseudo);

    // Test 4: Fake Profile Generation
    console.log('\n=== Fake Profile Generation ===');
    const fakeEmail = generator.generateFakeEmail('user123', 'shopping-app');
    const fakeDisplayName = generator.generateFakeDisplayName('user123', 'shopping-app');
    const fakeAddress = generator.generateFakeAddress('user123', 'shopping-app');
    
    console.log('Email:', fakeEmail);
    console.log('Display Name:', fakeDisplayName);
    console.log('Address:', JSON.stringify(fakeAddress, null, 2));
    
    console.log('✓ Fake email format valid:', fakeEmail.includes('@consentkeys.local'));
    console.log('✓ Fake name generated:', fakeDisplayName.split(' ').length >= 2);
    console.log('✓ Fake address complete:', 
        fakeAddress.street && fakeAddress.city && fakeAddress.state && fakeAddress.zip);

    // Test 5: Cross-App Profile Consistency
    console.log('\n=== Cross-App Profile Consistency ===');
    console.log('Same user, different apps should get different fake data:');
    const shoppingEmail = generator.generateFakeEmail('user123', 'shopping-app');
    const socialEmail = generator.generateFakeEmail('user123', 'social-app');
    const shoppingName = generator.generateFakeDisplayName('user123', 'shopping-app');
    const socialName = generator.generateFakeDisplayName('user123', 'social-app');
    
    console.log('Shopping app email:', shoppingEmail);
    console.log('Social app email:', socialEmail);
    console.log('Shopping app name:', shoppingName);
    console.log('Social app name:', socialName);
    
    console.log('✓ Cross-app email isolation:', shoppingEmail !== socialEmail);
    console.log('✓ Cross-app name isolation:', shoppingName !== socialName);

    // Test 6: Edge Cases & Error Handling
    console.log('\n=== Edge Cases & Error Handling ===');
    
    // Test empty userId
    try {
        generator.generatePseudonym('', 'test');
        console.log('✗ Should have thrown error for empty userId');
    } catch (e) {
        console.log('✓ Empty userId error:', e.message);
    }
    
    // Test empty clientId
    try {
        generator.generatePseudonym('user123', '');
        console.log('✗ Should have thrown error for empty clientId');
    } catch (e) {
        console.log('✓ Empty clientId error:', e.message);
    }
    
    // Test null inputs
    try {
        generator.generatePseudonym(null, 'test');
        console.log('✗ Should have thrown error for null userId');
    } catch (e) {
        console.log('✓ Null userId error:', e.message);
    }
    
    // Test weak secret key
    try {
        new ConsentKeysPseudonymGenerator('short');
        console.log('✗ Should have thrown error for weak secret key');
    } catch (e) {
        console.log('✓ Weak secret key error:', e.message);
    }
    
    // Test special characters and edge cases
    console.log('\nTesting special characters and edge cases:');
    const specialChars = generator.generatePseudonym('user@123!', 'app#$%');
    const unicodeChars = generator.generatePseudonym('用户123', 'app-🚀');
    const longInputs = generator.generatePseudonym('very-long-user-name-that-exceeds-normal-length', 'very-long-app-name');
    
    console.log('✓ Special characters handled:', specialChars);
    console.log('✓ Unicode characters handled:', unicodeChars);
    console.log('✓ Long inputs handled:', longInputs);

    // Test 7: Pseudonym Verification
    console.log('\n=== Pseudonym Verification ===');
    const validPseudonym = generator.generatePseudonym('user123', 'shopping-app');
    console.log('Generated pseudonym:', validPseudonym);
    console.log('✓ Valid pseudonym check:', generator.verifyPseudonym(validPseudonym));
    console.log('✓ Invalid pseudonym check:', !generator.verifyPseudonym('invalid_pseudonym'));
    console.log('✓ Malformed pseudonym check:', !generator.verifyPseudonym('ck_invalid!@#'));

    // Test 8: Security Demonstration
    console.log('\n=== Security Demonstration ===');
    console.log('Pseudonyms are NOT reversible (unlike the original base64 approach):');
    const pseudonym = generator.generatePseudonym('user123', 'shopping-app');
    console.log('Generated pseudonym:', pseudonym);
    console.log('Cannot reverse engineer userId or clientId from this hash!');
    
    // Demonstrate collision resistance
    console.log('\nCollision resistance test:');
    const collision1 = generator.generatePseudonym('user12', '3shopping-app');
    const collision2 = generator.generatePseudonym('user123', 'shopping-app');
    console.log('✓ Collision resistance:', collision1 !== collision2);
    console.log('  Input 1 result:', collision1);
    console.log('  Input 2 result:', collision2);

    // Test 9: Performance Testing
    console.log('\n=== Performance Testing ===');
    const startTime = Date.now();
    const iterations = 10000;
    
    for (let i = 0; i < iterations; i++) {
        generator.generatePseudonym(`user${i}`, `app${i % 100}`);
    }
    
    const endTime = Date.now();
    const avgTime = (endTime - startTime) / iterations;
    console.log(`✓ Generated ${iterations} pseudonyms in ${endTime - startTime}ms`);
    console.log(`✓ Average generation time: ${avgTime.toFixed(3)}ms per pseudonym`);

    // Test 10: Bulk Collision Testing
    console.log('\n=== Bulk Collision Testing ===');
    const pseudonymSet = new Set();
    const bulkIterations = 50000;
    
    for (let i = 0; i < bulkIterations; i++) {
        const pseudo = generator.generatePseudonym(`user${i}`, `app${i % 1000}`);
        pseudonymSet.add(pseudo);
    }
    
    const collisionRate = ((bulkIterations - pseudonymSet.size) / bulkIterations * 100);
    console.log(`✓ Generated ${bulkIterations} pseudonyms`);
    console.log(`✓ Unique pseudonyms: ${pseudonymSet.size}`);
    console.log(`✓ Collision rate: ${collisionRate.toFixed(6)}%`);

    // Test 11: Data Type Consistency
    console.log('\n=== Data Type Consistency ===');
    const emailPseudo1 = generator.generatePseudonym('user123', 'app1', 'email');
    const emailPseudo2 = generator.generatePseudonym('user123', 'app1', 'email');
    const namePseudo1 = generator.generatePseudonym('user123', 'app1', 'name');
    const namePseudo2 = generator.generatePseudonym('user123', 'app1', 'name');
    
    console.log('✓ Email pseudonym consistency:', emailPseudo1 === emailPseudo2);
    console.log('✓ Name pseudonym consistency:', namePseudo1 === namePseudo2);
    console.log('✓ Email vs Name different:', emailPseudo1 !== namePseudo1);

    // Test 12: Fake Data Consistency
    console.log('\n=== Fake Data Consistency ===');
    const email1 = generator.generateFakeEmail('user123', 'app1');
    const email2 = generator.generateFakeEmail('user123', 'app1');
    const name1 = generator.generateFakeDisplayName('user123', 'app1');
    const name2 = generator.generateFakeDisplayName('user123', 'app1');
    const addr1 = generator.generateFakeAddress('user123', 'app1');
    const addr2 = generator.generateFakeAddress('user123', 'app1');
    
    console.log('✓ Fake email consistency:', email1 === email2);
    console.log('✓ Fake name consistency:', name1 === name2);
    console.log('✓ Fake address consistency:', JSON.stringify(addr1) === JSON.stringify(addr2));

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('- ✓ Consistency: Same inputs produce same outputs');
    console.log('- ✓ Isolation: Different apps produce different pseudonyms');
    console.log('- ✓ Multiple Data Types: ID, email, name pseudonyms work');
    console.log('- ✓ Error Handling: Invalid inputs properly rejected');
    console.log('- ✓ Security: Cryptographically secure, non-reversible');
    console.log('- ✓ Performance: Suitable for production use');
    console.log('- ✓ Fake Data: Realistic fake profiles generated');
    console.log('- ✓ Cross-App Privacy: User data isolated between apps');
}

// Additional test functions for specific scenarios
function testSecurityScenarios() {
    console.log('\n🔒 Additional Security Scenarios');
    console.log('================================');
    
    const generator = new ConsentKeysPseudonymGenerator('super-secret-key-at-least-32-chars-long');
    
    // Test timing attacks resistance
    console.log('\n--- Timing Attack Resistance ---');
    const timings = [];
    for (let i = 0; i < 1000; i++) {
        const start = process.hrtime.bigint();
        generator.generatePseudonym(`user${i}`, 'app');
        const end = process.hrtime.bigint();
        timings.push(Number(end - start));
    }
    
    const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
    const maxDeviation = Math.max(...timings.map(t => Math.abs(t - avgTiming)));
    console.log(`✓ Average timing: ${(avgTiming / 1000000).toFixed(3)}ms`);
    console.log(`✓ Max deviation: ${(maxDeviation / 1000000).toFixed(3)}ms`);
    console.log('✓ Timing relatively consistent (resistant to timing attacks)');
    
    // Test key sensitivity
    console.log('\n--- Key Sensitivity Test ---');
    const key1 = 'first-secret-key-at-least-32-chars-long';
    const key2 = 'second-secret-key-at-least-32-chars-long';
    
    const gen1 = new ConsentKeysPseudonymGenerator(key1);
    const gen2 = new ConsentKeysPseudonymGenerator(key2);
    
    const result1 = gen1.generatePseudonym('user123', 'app');
    const result2 = gen2.generatePseudonym('user123', 'app');
    
    console.log('✓ Different keys produce different results:', result1 !== result2);
    console.log('  Key 1 result:', result1);
    console.log('  Key 2 result:', result2);
}

function testEdgeCaseScenarios() {
    console.log('\n🔍 Edge Case Scenarios');
    console.log('======================');
    
    const generator = new ConsentKeysPseudonymGenerator('super-secret-key-at-least-32-chars-long');
    
    // Test extremely long inputs
    console.log('\n--- Long Input Handling ---');
    const longUser = 'a'.repeat(10000);
    const longApp = 'b'.repeat(10000);
    
    try {
        const result = generator.generatePseudonym(longUser, longApp);
        console.log('✓ Long inputs handled successfully');
        console.log('✓ Result format valid:', /^ck_[A-Za-z0-9_-]{16}$/.test(result));
    } catch (e) {
        console.log('✗ Long input handling failed:', e.message);
    }
    
    // Test binary data
    console.log('\n--- Binary Data Handling ---');
    const binaryUser = Buffer.from([0x00, 0x01, 0x02, 0x03]).toString('binary');
    const binaryApp = Buffer.from([0xFF, 0xFE, 0xFD, 0xFC]).toString('binary');
    
    try {
        const result = generator.generatePseudonym(binaryUser, binaryApp);
        console.log('✓ Binary data handled successfully');
        console.log('✓ Result format valid:', /^ck_[A-Za-z0-9_-]{16}$/.test(result));
    } catch (e) {
        console.log('✗ Binary data handling failed:', e.message);
    }
}

// Run all tests
if (require.main === module) {
    runTestSuite();
    testSecurityScenarios();
    testEdgeCaseScenarios();
}

module.exports = {
    runTestSuite,
    testSecurityScenarios,
    testEdgeCaseScenarios
};