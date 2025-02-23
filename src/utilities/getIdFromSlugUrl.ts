function getIdFromSlugUrl(slug: string) {
    return Number(slug.split('-i.')[1]);
}

export default getIdFromSlugUrl;
