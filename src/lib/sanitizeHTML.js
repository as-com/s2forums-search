/* Sanitizes HTML - rewrites images to HTTPS */
const filters = [
    {
        re: /(<img(?:.*?)src=[\"\']?)http:\/\/(.+?\.(?:jpg|jpeg|png|gif))([\"\']?(?:.*?)>)/g,
        subst: '$1https://i0.wp.com/$2$3'
    },
];

export default function (str) {
    filters.forEach(function (filter) {
        str = str.replace(filter.re, filter.subst);
    });
    return str;
}
