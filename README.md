# OpenSearch.js
OpenSearch utilities for javascript (experimental / pre-pre-alpha)

---

```js
let urls = document.querySelectorAll('link[rel~="search" i][type="application/opensearchdescription+xml" i]');
let gettingEngines = [];

for (const url of urls) {
    gettingEngines.push(
        fetch(url).then(res => res.text()).then(parseOpenSearchXML)
    );
}
```

---

### Resources


- http://www.opensearch.org/Specifications/OpenSearch/1.1
- http://www.opensearch.org/Specifications/OpenSearch/Extensions/Suggestions
- http://www.opensearch.org/Documentation/Developer_how_to_guide
- http://www.opensearch.org/Documentation/Developer_best_practices_guide
- http://www.opensearch.org/Documentation/Recommendations/OpenSearch_and_microformats
- http://www.opensearch.org/Documentation/Stylesheet
- https://www.xml.com/pub/a/2007/07/20/introducing-opensearch.html
- https://developer.mozilla.org/en-US/Add-ons/Creating_OpenSearch_plugins_for_Firefox
- https://developer.mozilla.org/en-US/docs/Web/Guide/Parsing_and_serializing_XML
- https://tools.ietf.org/html/rfc2822#section-3.4.1
- https://www.w3.org/TR/2004/REC-xml-20040204/#sec-lang-tag
- https://www.w3.org/TR/2004/REC-xml-20040204/#charencoding
- https://www.w3.org/TR/html5/links.html#link-type-search
- https://html.spec.whatwg.org/multipage/semantics.html#link-type-search
