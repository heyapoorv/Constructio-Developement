import { storage } from './config';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

/**
 * Uploads an image to Firebase Storage and returns the download URL.
 * @param {File} file - The file to upload.
 * @param {string} path - The storage path (e.g., 'projects/image.jpg').
 * @param {function} onProgress - Optional callback for upload progress (progress => {}).
 */
export const uploadImage = async (file, path, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

/**
 * Deletes an image from Firebase Storage.
 * @param {string} path - The storage path to delete.
 */
export const deleteImage = async (path) => {
  const storageRef = ref(storage, path);
  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image: ", error);
    // Ignore if not found
  }
};
