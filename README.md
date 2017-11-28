# OpenSearch.js
OpenSearch utilities for javascript (experimental / pre-pre-alpha)

---

```js
let urls = document.querySelectorAll('link[rel~="search" i][type="application/opensearchdescription+xml" i]');
let gettingEngines = [];

for (const url of urls) {
    gettingEngines.push(
        fetch(url).then(res => res.text()).then(parseOpenSearchXML).then()
    );
}
```
