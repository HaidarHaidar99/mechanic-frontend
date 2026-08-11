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
export function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.70) {
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
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Initial compression attempt
        let compressedBase64 = canvas.toDataURL('image/jpeg', quality);

        // Calculate size in KB
        let sizeKB = (compressedBase64.length * 0.75) / 1024;

        // If size is over 160KB, re-compress with stronger quality reduction
        if (sizeKB > 160) {
          compressedBase64 = canvas.toDataURL('image/jpeg', 0.55);
          sizeKB = (compressedBase64.length * 0.75) / 1024;
        }

        // Hard limit check (max 220KB per compressed image document)
        if (sizeKB > 220) {
          return reject(new Error(`Compressed image (${sizeKB.toFixed(0)} KB) exceeds max 200 KB limit. Please choose a smaller image.`));
        }

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
