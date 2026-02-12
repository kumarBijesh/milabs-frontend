import QRCode from 'qrcode';

export const generateQRCode = async (data: string) => {
    try {
        const qrImage = await QRCode.toDataURL(data);
        return qrImage;
    } catch (err) {
        console.error('QR Code generation error:', err);
        throw err;
    }
};
