import API from './api';

export const uploadFileToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Image = reader.result;
        const res = await API.post('/upload', { image: base64Image });
        resolve(res.data.url);
      } catch (err) {
        reject(err.response?.data?.message || 'Failed to upload image to Cloudinary');
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
