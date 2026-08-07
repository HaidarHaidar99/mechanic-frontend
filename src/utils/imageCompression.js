/**
 * Resizes and compresses an image file using HTML5 Canvas.
 * Targets a payload file size of around 100-150KB.
 * 
 * @param {File} file The chosen image file from input
 * @param {number} maxWidth Maximum width constraint
 * @param {number} maxHeight Maximum height constraint
 * @param {number} quality JPEG compression quality (0.0 to 1.0)
 * @returns {Promise<string>} Resolves to a Base64 data URL
 */
export function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    // Validate file is indeed an image
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Clear and draw image on canvas
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with compression quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      
      img.onerror = (err) => {
        reject(new Error('Failed to load image element.'));
      };
    };

    reader.onerror = (err) => {
      reject(new Error('Failed to read file source.'));
    };
  });
}
