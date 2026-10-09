import imageCompression from "browser-image-compression";

export async function handleUpload(file: any) {
    let fileToCompress = file;

    if (typeof file === 'string') {
        const response = await fetch(file);
        const blob = await response.blob();
        const filename = file.split('/').pop()?.split('?')[0] || 'image.webp';
        fileToCompress = new File([blob], filename, { type: blob.type || 'image/webp' });
    }

    const compressedFile = await imageCompression(fileToCompress, {
        maxWidthOrHeight: 1920,
        maxSizeMB: 2,
        useWebWorker: true,
    });
    console.log('🌿handleUploadFile.ts:4/(compressedFile):', compressedFile);

    // Upload compressedFile
    return compressedFile;
}