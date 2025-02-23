import slugify from 'slugify';

function generateSlugUrl({ name, id }: { name: string; id: number }) {
    return `${slugify(name)}-i.${id}`;
}

export default generateSlugUrl;
