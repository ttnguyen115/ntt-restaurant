async function wrapServerApi<T>(fn: () => Promise<T>) {
    let result = null;
    try {
        result = await fn();
    } catch (error: any) {
        if (error?.digest?.includes('NEXT_REDIRECT')) {
            throw error;
        }
    }
    return result;
}

export default wrapServerApi;
