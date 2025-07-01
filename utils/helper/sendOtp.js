const redisClient = require("../../DB/redis.client");

async function sendOtp(email) {
    try {
        if (!email || typeof email !== 'string') {
            throw new Error('Invalid email address');
        }

        const emailKey = `email:${email}:otp`;
        let emailOtp = [];

        const existing = await redisClient.get(emailKey);
        if (existing) {
            emailOtp = JSON.parse(existing);
            if (emailOtp.length >= 5) emailOtp = emailOtp.slice(-5); // Limit to last 5 OTPs
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        emailOtp.push({ otp, timestamp: Date.now() });
        await redisClient.set(emailKey, JSON.stringify(emailOtp));
        await redisClient.expire(emailKey, 300); // 5-minute TTL

        console.log(`OTP ${otp} generated and stored for ${email}`);
        return otp;
    } catch (error) {
        console.error('Error in sendOtp:', error.message);
        throw error;
    }
}

async function checkOtp(email, inputOtp) {
    try {
        if (!email || typeof email !== 'string' || !inputOtp || isNaN(inputOtp)) {
            throw new Error('Invalid email or OTP');
        }

        const emailKey = `email:${email}:otp`;
        const existing = await redisClient.get(emailKey);

        if (!existing) {
            throw new Error('No OTP found for this email');
        }

        const emailOtp = JSON.parse(existing);
        const latestOtp = emailOtp[emailOtp.length - 1]; // Get the most recent OTP

        // Check if OTP matches and is within TTL (5 minutes = 300,000 ms)
        const isValid = latestOtp.otp === parseInt(inputOtp) &&
                       (Date.now() - latestOtp.timestamp) <= 300000;

        if (isValid) {
            console.log(`OTP validated for ${email}`);
            // Optionally delete the key after successful verification
            // await redisClient.del(emailKey);
            return true;
        } else {
            console.log(`Invalid or expired OTP for ${email}`);
            return false;
        }
    } catch (error) {
        console.error('Error in checkOtp:', error.message);
        throw error;
    }
}

// Example usage
// (async () => {
//     try {
//         const otp = await sendOtp('user@example.com');
//         console.log('Generated OTP:', otp);

//         // Simulate a user entering the OTP
//         const isValid = await checkOtp('user@example.com', otp);
//         console.log('OTP Check Result:', isValid);

//         // Simulate an invalid OTP
//         const isInvalid = await checkOtp('user@example.com', 1234);
//         console.log('Invalid OTP Check Result:', isInvalid);
//     } catch (error) {
//         console.error(error);
//     }
// })();