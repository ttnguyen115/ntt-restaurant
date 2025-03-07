import { convert } from 'html-to-text';

function htmlToTextForMetadataDescription(html: string) {
    return convert(html, {
        limits: {
            maxInputLength: 140,
        },
    });
}

export default htmlToTextForMetadataDescription;
