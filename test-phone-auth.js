/**
 * Test script for phone-based authentication
 * This script demonstrates the complete phone auth flow
 */

const BASE_URL = 'http://localhost:3000/api/auth';

// Test data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+1234567890'
};

async function testPhoneAuthentication() {
  console.log('🚀 Starting Phone Authentication Test\n');

  try {
    // Step 1: Register with phone
    console.log('1️⃣ Registering user with phone number...');
    const registerResponse = await fetch(`${BASE_URL}/register/phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();
    
    if (registerData.success) {
      console.log('✅ Registration successful');
      console.log(`   User ID: ${registerData.data.user._id}`);
      console.log(`   Status: ${registerData.data.user.status}`);
      console.log(`   Phone Verified: ${registerData.data.user.isPhoneVerified}`);
      console.log(`   Message: ${registerData.data.message}\n`);
    } else {
      console.log('❌ Registration failed:', registerData.error);
      return;
    }

    // Step 2: Verify phone (simulate OTP verification)
    console.log('2️⃣ Verifying phone number...');
    console.log('   📱 Check your logs for the OTP code (in development mode)');
    console.log('   📱 In production, you would receive an SMS');
    
    // For testing, we'll simulate getting the OTP from logs
    // In real scenario, user would enter the OTP they received
    const otpCode = '123456'; // This would come from SMS in production
    
    const verifyResponse = await fetch(`${BASE_URL}/verify-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: testUser.phoneNumber,
        otpCode: otpCode
      })
    });

    const verifyData = await verifyResponse.json();
    
    if (verifyData.success) {
      console.log('✅ Phone verification successful');
      console.log(`   Status: ${verifyData.data.user.status}`);
      console.log(`   Phone Verified: ${verifyData.data.user.isPhoneVerified}`);
      console.log(`   Message: ${verifyData.data.message}\n`);
    } else {
      console.log('❌ Phone verification failed:', verifyData.error);
      console.log('   Note: This is expected in test mode as we used a dummy OTP\n');
    }

    // Step 3: Request login OTP
    console.log('3️⃣ Requesting login OTP...');
    const requestOtpResponse = await fetch(`${BASE_URL}/request-phone-login-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: testUser.phoneNumber
      })
    });

    const requestOtpData = await requestOtpResponse.json();
    
    if (requestOtpData.success) {
      console.log('✅ Login OTP requested successfully');
      console.log(`   Message: ${requestOtpData.data.message}\n`);
    } else {
      console.log('❌ Login OTP request failed:', requestOtpData.error);
      return;
    }

    // Step 4: Login with phone and OTP
    console.log('4️⃣ Logging in with phone and OTP...');
    console.log('   📱 Check your logs for the login OTP code');
    
    const loginOtpCode = '123456'; // This would come from SMS in production
    
    const loginResponse = await fetch(`${BASE_URL}/login/phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: testUser.phoneNumber,
        otpCode: loginOtpCode,
        deviceId: 'test-device-123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Login successful');
      console.log(`   Access Token: ${loginData.data.accessToken.substring(0, 20)}...`);
      console.log(`   Refresh Token: ${loginData.data.refreshToken.substring(0, 20)}...`);
      console.log(`   Expires At: ${loginData.data.expiresAt}\n`);
    } else {
      console.log('❌ Login failed:', loginData.error);
      console.log('   Note: This is expected in test mode as we used a dummy OTP\n');
    }

    // Step 5: Test protected endpoint
    if (loginData.success) {
      console.log('5️⃣ Testing protected endpoint...');
      const profileResponse = await fetch(`${BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.data.accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      const profileData = await profileResponse.json();
      
      if (profileData.success) {
        console.log('✅ Protected endpoint access successful');
        console.log(`   User: ${profileData.data.firstName} ${profileData.data.lastName}`);
        console.log(`   Phone: ${profileData.data.phoneNumber}`);
        console.log(`   Role: ${profileData.data.role}\n`);
      } else {
        console.log('❌ Protected endpoint access failed:', profileData.error);
      }
    }

    console.log('🎉 Phone Authentication Test Completed!');
    console.log('\n📝 Notes:');
    console.log('   - In development mode, OTP codes are logged to console');
    console.log('   - In production, OTP codes are sent via SMS');
    console.log('   - The test uses dummy OTP codes, so verification steps will fail');
    console.log('   - Check the server logs to see the actual OTP codes generated');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testPhoneAuthentication();
