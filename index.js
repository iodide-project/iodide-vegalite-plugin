const resources = [
  'https://cdn.jsdelivr.net/npm/vega@5.7.2',
  'https://cdn.jsdelivr.net/npm/vega-lite@4.0.0-beta.10',
  'https://cdn.jsdelivr.net/npm/vega-embed@5.1.3'
];

const loadResource = url => new Promise((resolve) => {
  const head = document.getElementsByTagName('head')[0];
  const theScript = document.createElement('script');
  theScript.src = url;
  theScript.onload = () => {
    resolve();
  };
  head.appendChild(theScript);
})

resources.reduce((p, r) => { return p.then(() => loadResource(r)) }, Promise.resolve())
  .then(() => {
    window.vegaLitePlugin = {}
    window.vegaLitePlugin.evaluateVegaLite = (input) => {
      const elem = iodide.output.element('div');
      const id = "iodide-vegaLite-" + Date.now();
      elem.setAttribute("class", "iodideVegaLite");
      elem.style.textAlign = "center";
      vegaEmbed(elem, eval('(' + input + ')'));

      return elem
    }
    window.iodide.addOutputRenderer({
      shouldRender: val => { return val.getAttribute('class') === 'iodideVegaLite'; },
      render: (val) => {
        return val.innerHTML;
      },
    });
  });
