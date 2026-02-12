import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-fallback-secret-key-change-this';

/**
 * Encrypts sensitive data (like passwords) for storage.
 * Note: Storing reversible passwords is generally insecure.
 * Only use this if absolutely required for specific admin access.
 */
export const encryptData = (text: string): string => {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

/**
 * Decrypts sensitive data.
 * @param cipherText The encrypted string
 * @returns The original plain text
 */
export const decryptData = (cipherText: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    } catch (error) {
        console.error('Decryption failed:', error);
        return '';
    }
};
