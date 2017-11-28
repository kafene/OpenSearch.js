
/** @return {Array} Array of detected engines. */
const parseOpenSearchXML = function (xml) {
    // const xmlDoc = $.parseXML(xml);
    // const $xml = $(xmlDoc);

    const dp = new DOMParser();
    // const $xml = dp.parseFromString(xml, "application/opensearchdescription+xml");
    const $xml = dp.parseFromString(xml, "text/xml");

    // The OpenSearchDescription element must appear exactly once as the root node of the document.
    const osd = $xml.querySelectorAll("OpenSearchDescription");

    const engine = {};

    const tagValue = (tag, dflt=null) => (elem = osd.querySelector(tag)) ? elem.textContent : dflt;
    const tagValues = (tag) => Array.from(osd.querySelectorAll(tag)).map((elem) => elem.textContent);

    const KNOWN_RELS = [
        // Default. Represents a request for search results in the specified format.
        "results",

        // Represents a request for search suggestions in the specified format.
        "suggestions",

        // Represents the canonical URL of this description document.
        "self",

        // Represents a request for a set of resources.
        "collection",
    ];

    // Parent: OpenSearchDescription
    // This element must appear exactly once.
    // The value must contain 16 or fewer characters of plain text.
    // The value must not contain HTML or other markup.
    engine.name = tagValue("ShortName");

    // Parent: OpenSearchDescription
    // The value must contain 1024 or fewer characters of plain text.
    // The value must not contain HTML or other markup.
    // This element must appear exactly once.
    engine.description = tagValue("Description");

    // Parent: OpenSearchDescription
    // The value must conform to the requirements of Section 3.4.1 "Addr-spec specification" in RFC 2822.
    // This element may appear zero or one time.
    engine.contact = tagValue("Contact");

    // Contains a set of words that are used as keywords to identify and categorize this search content.
    // Tags must be a single word and are delimited by the space character (' ').
    // Parent: OpenSearchDescription
    // The value must contain 256 or fewer characters of plain text.
    // The value must not contain HTML or other markup.
    // This element may appear zero or one time.
    engine.tags = tagValue("Tags", "").split(/\s+/);

    // Parent: OpenSearchDescription
    // The value must contain 48 or fewer characters of plain text.
    // The value must not contain HTML or other markup.
    // This element may appear zero or one time.
    engine.longName = tagValue("LongName");

    // The developer is the person or entity that created the description document,
    // and may or may not be the owner, author, or copyright holder of the source of the content itself.
    // Parent: OpenSearchDescription
    // value must contain 64 or fewer characters of plain text.
    // The value must not contain HTML or other markup.
    // This element may appear zero or one time.
    engine.developer = tagValue("Developer");

    // Contains a list of all sources or entities that should be credited for the content contained in the search feed.
    // Parent: OpenSearchDescription
    // The value must contain 256 or fewer characters of plain text.
    // The value must not contain HTML or other markup.
    // This element may appear zero or one time.
    engine.attribution = tagValue("Attribution");

    // Contains a value that indicates the degree to which the search results provided by this search engine can be queried, displayed, and redistributed.
    // Parent: OpenSearchDescription
    // Values: The value must be one of the following strings (case insensitive):
    // "open" –
    //     The search client may request search results.
    //     The search client may display the search results to end users.
    //     The search client may send the search results to other search clients.
    // "limited" –
    //     The search client may request search results.
    //     The search client may display the search results to end users.
    //     The search client may not send the search results to other search clients.
    // "private" –
    //     The search client may request search results.
    //     The search client may not display the search results to end users.
    //     The search client may not send the search results to other search clients.
    // "closed" -
    //     The search client may not request search results.
    // Default: "open"
    // This element may appear zero or one time.
    engine.syndicationRight = tagValue("SyndicationRight");

    // Contains a boolean value that should be set to true if the search results may contain material intended only for adults.
    // Parent: OpenSearchDescription
    // The values "false", "FALSE", "0", "no", and "NO" will be considered boolean FALSE; all other strings will be considered boolean TRUE.
    // Default: "false"
    // This element may appear zero or one time.
    engine.adultContent = !["false", "FALSE", "0", "no", "NO"].includes(String(tagValue("AdultContent", "false")).trim());

    // <Language>
    // Contains a string that indicates that the search engine supports search results in the specified language.
    // An OpenSearch description document should include one "Language" element for each language that the search engine supports.
    // If the search engine also supports queries for any arbitrary language then the OpenSearch description document should include a Language element with a value of "*".
    // The "language" template parameter in the OpenSearch URL template can be used to allow the search client to choose among the available languages.
    // Parent: OpenSearchDescription
    // The value must conform to the XML 1.0 Language Identification, as specified by RFC 5646.
    // In addition, the value of "*" will signify that the search engine does not restrict search results to any particular language.
    // Default: "*".
    // This element may appear zero, one, or more times.
    engine.languages = Array.from(osd.querySelectorAll("Language")).map((language) => language.textContent.trim());
    engine.languages = (engine.languages.length === 0) ? ["*"] : engine.languages;

    // Contains a string that indicates that the search engine supports search requests encoded with the specified character encoding.
    // An OpenSearch description document should include one "InputEncoding" element for each character encoding that can be used to encode search requests.
    // The "inputEncoding" template parameter in the OpenSearch URL template can be used to require the search client to identify which encoding is being used to encode the current search request.
    // Parent: OpenSearchDescription
    // Restrictions: The value must conform to the XML 1.0 Character Encodings, as specified by the IANA Character Set Assignments.
    // Default: "UTF-8".
    // Requirements: This element may appear zero, one, or more times.
    engine.inputEncodings = Array.from(osd.querySelectorAll("InputEncoding")).map((inputEncoding) => inputEncoding.textContent.trim());
    engine.inputEncodings = (engine.inputEncodings.length === 0) ? ["UTF-8"] : engine.inputEncodings;

    // Contains a string that indicates that the search engine supports search responses encoded with the specified character encoding.
    // An OpenSearch description document should include one "OutputEncoding" element for each character encoding that can be used to encode search responses.
    // The "outputEncoding" template parameter in the OpenSearch URL template can be used to allow the search client to choose a character encoding in the search response.
    // Parent: OpenSearchDescription
    // Restrictions: The value must conform to the XML 1.0 Character Encodings, as specified by the IANA Character Set Assignments.
    // Default: "UTF-8".
    // Requirements: This element may appear zero, one, or more times.
    engine.outputEncodings = Array.from(osd.querySelectorAll("OutputEncoding")).map((inputEncoding) => inputEncoding.textContent.trim());
    engine.outputEncodings = (engine.outputEncodings.length === 0) ? ["UTF-8"] : engine.outputEncodings;

    // <moz:SearchForm>
    engine.mozSearchForm = tagValue("SearchForm");

    // Mozilla / Proprietary
    engine.mozUpdateURL = tagValue("UpdateUrl");

    // Mozilla / Proprietary
    engine.mozUpdateInterval = tagValue("UpdateInterval");

    // Mozilla / Proprietary
    engine.mozIconUpdateURL = tagValue("IconUpdateUrl");

    // <Url>
    // Parent: OpenSearchDescription
    // This element must appear one or more times.
    engine.urls = Array.from(osd.querySelectorAll("Url")).map((url) => {
        return {
            // The MIME type of the resource being described.
            // The value must be a valid MIME type.
            // This attribute is required.
            type: url.getAttribute("type"),

            // The URL template to be processed according to the OpenSearch URL template syntax.
            // This attribute is required.
            template: url.getAttribute("template"),

            // Proprietary???
            method: url.getAttribute("method"),

            // The role of the resource being described in relation to the description document.
            // Contains a space-delimited list of valid rel value tokens.
            // Default: "results"
            rels: (url.getAttribute("rel") || "results").split(/\s+/),

            // The index number of the first search result.
            // The value must be an integer.
            // Default: "1"
            indexOffset: Number.parseInt((url.getAttribute("indexOffset") || "1"), 10),

            // The page number of the first set of search results.
            // The value must be an integer.
            // Default: "1"
            pageOffset: Number.parseInt((url.getAttribute("pageOffset") || "1"), 10),

            // Proprietary???
            resultDomain: url.getAttribute("resultDomain"),

            // Proprietary to Mozilla.
            params: Array.from(url.querySelectorAll("Param")).map((param) => {
                return {name: param.getAttribute("name"), value: param.getAttribute("value")};
            }),
        };
    });

    // <Image>
    // Image sizes are offered as a hint to the search client.
    // The search client will choose the most appropriate image for the available space and
    // should give preference to those listed first in the OpenSearch description document.
    // Square aspect ratios are recommended.
    // When possible, search engines should offer a 16x16 image of type "image/x-icon"
    // or "image/vnd.microsoft.icon" (the Microsoft ICON format) and a 64x64 image
    // of type "image/jpeg" or "image/png".
    // Parent: OpenSearchDescription
    // The value must be a URI.
    // This element may appear zero, one, or more times.
    engine.images = Array.from(osd.querySelectorAll("Image")).map((img) => {
        return {
            // The value must be a non-negative integer. This attribute is optional.
            height: img.getAttribute("height"),

            // The value must be a non-negative integer. This attribute is optional.
            width: img.getAttribute("width"),

            // The value must be a valid MIME type. This attribute is optional.
            type: img.getAttribute("type"),

            url: String(img.innerHTML).trim(),
        };
    });

    // <Query>
    // Defines a search query that can be performed by search clients.
    // OpenSearch description documents should include at least one Query element
    // of role="example" that is expected to return search results.
    // Search clients may use this example query to validate that the search engine is working properly.
    // Parent: OpenSearchDescription
    // Requirements: This element may appear zero or more times.
    // --
    // The Query element attributes correspond to the search parameters in a URL template.
    // The core set of search parameters are explicitly defined as Query attributes, and custom parameters can be added via namespaces as needed.
    // Authors should provide at least one Query element of role="example" in each OpenSearch description document so that search clients can test the search engine. Search engines should include a Query element of role="request" in each search response so that search clients can recreate the current search.
    // Examples:
    //      <Query role="example" searchTerms="cat" />
    //      <Query role="request" searchTerms="cat" startPage="1" />
    //      <Query role="correction" searchTerms="OpenSearch" totalResults="854000" title="Spelling correction" />
    //      <Query xmlns:custom="http://example.com/opensearchextensions/1.0/" role="example" searchTerms="cat" custom:color="blue" title="Sample search" />
    //      <Query xmlns:custom="http://example.com/opensearchextensions/1.0/" role="custom:synonym" title="Synonym of 'cat'" searchTerms="feline" />
    //      Detailed example of a set of Query elements used in the context of an Atom-based OpenSearch response:
             // <?xml version="1.0" encoding="UTF-8"?>
             // <feed xmlns="http://www.w3.org/2005/Atom"
             //       xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">
             //   <!--- ... --->
             //   <opensearch:Query role="request" searchTerms="General Motors annual report" />
             //   <opensearch:Query role="related" searchTerms="GM" title="General Motors stock symbol" />
             //   <opensearch:Query role="related" searchTerms="automotive industry revenue" />
             //   <opensearch:Query role="subset" searchTerms="General Motors annual report 2005"
             //   <opensearch:Query role="superset" searchTerms="General Motors" />
             //   <!-- ... -->
             // </feed>
    // --
    // Describes a specific search request that can be made by the search client.
    // The Query element may contain additional attributes if the extended attributes are associated with a namespace. Search clients should interpret extended attributes to represent the corresponding template parameter by the same name in the specified namespace.
    // Example of a Query element representing a search request that contains an extended attribute that corresponds to an extended search parameter:
    //      <OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:custom="http://example.com/opensearchextensions/1.0/">
    //      <Url type="text/html" template="http://example.com/search?color={custom:color?}" />
    //      <Query role="example"  custom:color="blue" />
    //      <!-- ... -->
    //      </OpenSearchDescription>
    // A role value consists of an optional prefix followed by the local role value. If the prefix is present it will be separated from the local role value with the ":" character. All role values are associated with a namespace, either implicitly in the case of local role values, or explicitly via a prefix in the case of fully qualified role values.
    // The role attribute may take on values beyond those specified in this document provided they are fully qualified with a prefix and associated with a declared namespace. Clients that encounter unrecognized role values should continue to process the document as if the Query element containing the unrecognized role value did not appear.
    // A role prefix associates a local role name with a namespace. All prefixes must be previously declared as an XML namespace prefix on the containing Query element or ancestor elements.
    // Local role values are not preceded by a prefix. Local role values are associated with the OpenSearch 1.1 namespace.
    /*
    The following role values are identified with the OpenSearch 1.1 namespace. The list is exhaustive; only the role values listed below may appear in the OpenSearch 1.1 namespace.
    Role values:
        "request"
            Represents the search query that can be performed to retrieve the same set of search results.
        "example"
            Represents a search query that can be performed to demonstrate the search engine.
        "related"
            Represents a search query that can be performed to retrieve similar but different search results.
        "correction"
            Represents a search query that can be performed to improve the result set, such as with a spelling correction.
        "subset"
            Represents a search query that will narrow the current set of search results.
        "superset"
            Represents a search query that will broaden the current set of search results.
    */
    // Example: <Query role="related" title="A related search" searchTerms="tiger" />
    // Fully qualified role values are preceded by a prefix. Fully qualified role values are associated with the namespace identified by the prefix on the containing Query element or ancestor elements.
    // Example of a fully qualified role value:
    //      <Query xmlns:custom="http://example.com/opensearchextensions/1.0/" role="custom:synonym" title="Synonyms of 'cat'" searchTerms="feline" />
    engine.queries = Array.from(osd.querySelectorAll("Query")).map((q) => {
        const query = {
            // Contains a string identifying how the search client should interpret the search request defined by this Query element.
            // See the role values specification for allowed role values.
            // This attribute is required.
            role: q.getAttribute("role"),

            // Contains a human-readable plain text string describing the search request.
            // The value must contain 256 or fewer characters of plain text. The value must not contain HTML or other markup.
            // This attribute is optional.
            title: q.getAttribute("title"),

            // Contains the expected number of results to be found if the search request were made.
            // Restrictions: The value is a non-negative integer.
            // Requirements: This attribute is optional.
            totalResults: q.getAttribute("totalResults"),

            // Contains the value representing the "searchTerms" as an OpenSearch 1.1 parameter.
            // Restrictions: See the "searchTerms" parameter.
            // Requirements: This attribute is optional.
            searchTerms: q.getAttribute("searchTerms"),

            // Contains the value representing the "count" as a OpenSearch 1.1 parameter.
            // Restrictions: See the "count" parameter.
            // Requirements: This attribute is optional.
            count: q.getAttribute("count"),

            // Contains the value representing the "startIndex" as an OpenSearch 1.1 parameter.
            // Restrictions: See the "startIndex" parameter.
            // Requirements: This attribute is optional.
            startIndex: q.getAttribute("startIndex"),

            // Contains the value representing the "startPage" as an OpenSearch 1.1 parameter.
            // Restrictions: See the "startPage" parameter.
            // Requirements: This attribute is optional.
            startPage: q.getAttribute("startPage"),

            // Contains the value representing the "language" as an OpenSearch 1.1 parameter.
            // Restrictions: See the "language" parameter.
            // Requirements: This attribute is optional.
            language: q.getAttribute("language"),

            // Contains the value representing the "inputEncoding" as an OpenSearch 1.1 parameter.
            // Restrictions: See the "inputEncoding" parameter.
            // Requirements: This attribute is optional.
            inputEncoding: q.getAttribute("inputEncoding"),

            // Contains the value representing the "outputEncoding" as an OpenSearch 1.1 parameter.
            // Restrictions: See the "outputEncoding" parameter.
            // Requirements: This attribute is optional.
            outputEncoding: q.getAttribute("outputEncoding"),
        };

        for (const attr of q.attributes) {
            if (["role", "title", "totalResults", "searchTerms", "count", "startIndex", "startPage", "language", "inputEncoding", "outputEncoding"].includes(attr.name)) {
                continue;
            }

            if (attr.namespaceURI) {
                if (query[attr.namespaceURI]) {
                    query[attr.namespaceURI][attr.name] = attr.value;
                } else {
                    query[attr.namespaceURI] = {};
                    query[attr.namespaceURI][attr.name] = attr.value;
                }
            } else {
                query[attr.name] = attr.value;
            }
        }

        return query;
    });

    // URL templates:
    // The OpenSearch URL template format can be used to represent a parameterized form of the URL by which a search engine is queried.
    // The search client will process the URL template and attempt to replace each instance of a template parameter, generally represented in the form {name}, with a value determined at query time.
    // By default, parameter names are considered part of the OpenSearch 1.1 template namespace, and definitions for a set of core search parameter names are provided in this specification. However, search engines and search clients can adopt new parameter names using an extensibility mechanism based on the XML namespace prefix conventions.
    // Example of a search URL template that contains a template parameter:
    //      http://example.com/search?q={searchTerms}
    // Example of a search URL template that contains an optional template parameter:
    //      http://example.com/feed/{startPage?}
    // Example of a search URL template that contains an optional template parameter in an extended namespace, shown in the context of a Url element:
    //      <Url type="application/rss+xml" xmlns:example="http://example.com/opensearchextensions/1.0/" template="http://example.com?q={searchTerms}&amp;c={example:color?}"/>
    // The grammar of an OpenSearch URL template is defined by the following set of ABNF rules, as specified in RFC 2234.
    // The grammar rules defined in this document build upon a subset of the rules defined for the Uniform Resource Identifier (URI): Generic Syntax in RFC 3986. For brevity, rules already stated in RFC 3986 are referenced in this document by rule name alone and are not restated here in their entirety.
    /*
         ttemplate      = tscheme ":" thier-part [ "?" tquery ] [ "#" tfragment ]
         tscheme        = *( scheme / tparameter )
         thier-part     = "//" tauthority ( tpath-abempty / tpath-absolute / tpath-rootless / path-empty )
         tauthority     = [ tuserinfo "@" ] thost [ ":" tport ]
         tuserinfo      = *( userinfo / tparameter )
         thost          = *( host / tparameter )
         tport          = *( port / tparameter )
         tpath-abempty  = *( "/" tsegment )
         tsegment       = *( segment / tparameter )
         tpath-absolute = "/" [ tsegment-nz *( "/" tsegment ) ]
         tsegment-nz    = *( segment-nz / tparameter )
         tpath-rootless = tsegment-nz *( "/" tsegment )
         tparameter     = "{" tqname [ tmodifier ] "}"
         tqname         = [ tprefix ":" ] tlname
         tprefix        = *pchar
         tlname         = *pchar
         tmodifier      = "?"
         tquery         = *( query / tparameter )
         tfragement     = *( fragement / tparameter )
    */
    // The search client must replace every instance of a template parameter with a value before the search request is performed.
    // If a search engine wishes to indicate that a template parameter is optional and can be replaced with the empty string, then the "?" notation described in the section on optional template parameters should be used.
    // A parameter name consists of an optional parameter name prefix followed by the local parameter name. If the parameter name prefix is present then it will be separated from the local parameter name with the ":" character. All parameter names are associated with a parameter namespace. In the case of unqualified parameter names, the local parameter name is implicitly associated with the OpenSearch 1.1 namespace. In the case of fully qualified parameter names, the local parameter name is explicitly associated with an external namespace via the parameter name prefix.
    // Both the parameter name prefix and the local parameter name are case sensitive.
    // A parameter name prefix associates a local parameter name with a parameter namespace. All parameter name prefixes must be previously declared as an XML namespace prefix on the containing element or ancestor elements.
    // The choice of prefix is at the discretion of the author of the OpenSearch description document. Search clients should make no assumption as to the meaning of any particular literal prefix string, and should rely exclusively on the mapping of prefix strings to XML namespace declarations when parsing fully qualified parameter names.
    // Example of two equivalent URL templates that will be processed identically by search clients:
    //      <Url type="application/rss+xml" xmlns:a="http://example.com/extensions/" template="http://example.com?q={a:localname?}"/>
    //      <Url type="application/rss+xml" xmlns:b="http://example.com/extensions/" template="http://example.com?q={b:localname?}"/>
    // Unqualified parameter names consist of only a local parameter name and do not include a parameter name prefix. Unqualified parameter names in OpenSearch URL templates are implicitly associated with the OpenSearch 1.1 namespace.
    // This specification includes an exhaustive list of all unqualified OpenSearch 1.1 parameter names.
    //      <Url type="application/rss+xml" template="http://example.com/?q={searchTerms}"/>
    // Fully qualified parameter names consist of a parameter name prefix, followed by the ":" character, followed by the local parameter name. Fully qualified parameter names are associated with the namespace identified by the paramater name prefix, as it appears as an XML namespace declaration on the containing element or ancestor elements.
    // Example of a fully qualified parameter name:
    //      <Url type="application/rss+xml" xmlns:example="http://example.com/opensearchextensions/1.0/" template="http://example.com?f={example:format?}"/>
    // Required template parameters are template parameters that do not contain a template parameter modifier. The search client may use the default value if one is known, but may not use the empty string as a value.
    // Optional template parameters are template parameters that contain a template parameter modifier equal to "?". The search client may use the empty string as a value if no other value is available.
    // The following local parameter names are identified with the OpenSearch 1.1 namespace. The list is exhaustive; only the local parameter names listed below may appear unqualified in an OpenSearch URL template.
    // Search clients should be prepared to substitute reasonable values for these parameter names when they appear in an OpenSearch URL template.
    //      The "searchTerms" parameter
    //          Replaced with the keyword or keywords desired by the search client.
    //          Restrictions: The value must be URL-encoded.
    //           The "count" parameter
    //              Replaced with the number of search results per page desired by the search client.
    //              Search clients should anticipate that the value of the "count" parameter may not be honored by the search engine, and should rely exclusively on the contents of the "itemsPerPage" response element in calculating actual page size.
    //              Restrictions: The value must be a non-negative integer.
    //       The "startIndex" parameter
    //              Replaced with the index of the first search result desired by the search client.
    //              Restrictions: The value must be an integer.
    //              Default: The value specified by the "indexOffset" attribute of the containing Url element.
    //       The "startPage" parameter
    //              Replaced with the page number of the set of search results desired by the search client.
    //              Restrictions: The value must be an integer.
    //              Default: The value specified by the "pageOffset" attribute of the containing Url element.
    //       The "language" parameter
    //              Replaced with a string that indicates that the search client desires search results in the specified language.
    //                  An OpenSearch description document should include one "Language" element for each language that the search engine supports. If the search engine also supports queries for any arbitrary language then the OpenSearch description document should include a Language element with a value of "*". The "language" template parameter in the OpenSearch URL template can be used to allow the search client to choose among the available languages.
    //                  Restrictions: The value must conform to the XML 1.0 Language Identification, as specified by RFC 5646. In addition, a value of "*" will signify that the search client desires search results in any language.
    //                  Default: "*"
    //       The "inputEncoding" parameter
    //              Replaced with a string that indicates that the search client is performing the search request encoded with the specified character encoding.
    //              An OpenSearch description document should include one "InputEncoding" element for each character encoding that can be used to encode search requests. The "inputEncoding" template parameter in the OpenSearch URL template can be used to require the search client to identify which encoding is being used to encode the current search request.
    //              Restrictions: The value must conform to the XML 1.0 Character Encodings, as specified by the IANA Character Set Assignments.
    //              Default: "UTF-8"
    //       The "outputEncoding" parameter
    //              Replaced with a string that indicates that the search client desires a search response encoding with the specified character encoding.
    //              An OpenSearch description document should include one "OutputEncoding" element for each character encoding that can be used to encode search responses. The "outputEncoding" template parameter in the OpenSearch URL template can be used to allow the search client to choose a character encoding in the search response.
    //              Restrictions: The value must conform to the XML 1.0 Character Encodings, as specified by the IANA Character Set Assignments.
    //              Default: "UTF-8"
    // --

    return engine;
};
