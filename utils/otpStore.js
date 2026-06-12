// otpStore.js
const otpStore = new Map();

export const setOtp = (email, otp) => {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
};

export const getOtp = (email) => otpStore.get(email);

export const deleteOtp = (email) => otpStore.delete(email);