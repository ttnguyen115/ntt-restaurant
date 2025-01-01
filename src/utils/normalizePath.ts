/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
const normalizePath = (path: string) => {
    return path.startsWith('/') ? path.slice(1) : path;
};

export default normalizePath;
