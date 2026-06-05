type StructuredDataProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** In-DOM JSON-LD for crawlers that execute JS but miss route head tags. */
export function StructuredData({ data }: StructuredDataProps) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.map((schema) => (
        <script
          key={JSON.stringify(schema["@type"] ?? schema)}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
