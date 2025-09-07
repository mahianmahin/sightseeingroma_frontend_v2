import { Helmet } from "react-helmet-async";

export default function HelmetWrapper({ title, description, keywords, schema }) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
    )
}