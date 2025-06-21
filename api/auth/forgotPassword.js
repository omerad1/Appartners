import api from "../client";
import endpoints from "../endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const emailVerifcation = async (email) => {
    try {
        const response = await api.post(endpoints.auth.sendOTP, { email })
        console.log("Email verification success: ", response.data)
        return { success: true, data: response.data }
    } catch (error) {
        console.error("Email verification error:", error.response?.data || error.message)
        return { 
            success: false, 
            error: error.response?.data?.message || error.response?.data || error.message || "Failed to send verification code"
        }
    }
}

export const otpVerifcation = async (email, otp_code) => {
    try {
        const response = await api.post(endpoints.auth.verifyOTP, { email, otp_code })
        
        if (response && response.data && response.data.token) {
            await AsyncStorage.setItem('token', response.data.token)
            return { success: true, data: response.data }
        } else {
            return { 
                success: false, 
                error: "No token received from server"
            }
        }
    } catch (error) {
        // Don't log errors to console in production
        return { 
            success: false, 
            error: error.response?.data || error.message || "Failed to verify OTP code"
        }
    }
}
export const resetPassword = async (new_password, reset_token) => {
    try {
        const response = await api.post(endpoints.auth.forgotPassword, { new_password, reset_token})
        return { success: true, data: response.data }
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message || "Failed to reset password"
        }
    }
}