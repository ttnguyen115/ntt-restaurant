/**
 * Remove the first letter '/' of url path string
 */
const normalizePath = (path: string) => {
    return path.startsWith('/') ? path.slice(1) : path;
};

export default normalizePath;
