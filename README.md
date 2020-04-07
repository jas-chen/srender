[![npm version](https://img.shields.io/npm/v/srender.svg?style=flat-square)](https://www.npmjs.com/package/srender)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/srender.svg?style=flat-square)](https://bundlephobia.com/result?p=srender)

# srender
Stream based renderer

## Features
- Tiny (only ~80 sloc)
- Component
- Context
- SSR and (partial) hydration

## Todo example
```javascript
import { createHtml, createRef, renderToNode, rawHtml } from "srender";

const root = document.getElementById("root");

const TodoItem = (html, props, context) => html`
  <li>
    ${props.item}_${context.name}
    <button type="button" name="deleteButton">X</button>
  </li>
`;

function TodoMVC(html, { items = [] }, context) {
  const { createRef } = context;
  const formRef = createRef();
  const inputRef = createRef();
  const listRef = createRef();

  html`
    <h1>Todo MVC</h1>
    ${rawHtml("<h2>srender example</h2>")}
    <form id="${formRef}">
      <input id="${inputRef}" />
      <button>Add</button>
    </form>
    <ul id="${listRef}">
      ${() => {
        const html = createHtml({
          ...context,
          name: "second",
        });
        html(TodoItem, { item: "test" });
      }}
      ${() => items.map(item => html(TodoItem, { item }))}
    </ul>
  `;

  // component did mount
  return () => {
    const $form = formRef.get();
    const $input = inputRef.get();
    const $list = listRef.get();

    $form.onsubmit = e => {
      e.preventDefault();
      renderToNode(
        () => {
          const html = createHtml({
            ...context,
            name: "third",
          });
          html(TodoItem, { item: $input.value });
        },
        node => $list.appendChild(node),
      );
      $form.reset();
    };

    $list.onclick = ({ target }) => {
      if (target.name === "deleteButton") {
        target.closest("li").remove();
      }
    };

    requestAnimationFrame(() => $input.focus());
  };
}

renderToNode(
  () => {
    const context = {
      createRef: createRef.bind({}), // initialize createRef
      name: "root",
    };

    const html = createHtml(context);

    html(TodoMVC, { items: ["foo", "bar"] });
  },
  node => root.appendChild(node)
);
```

## SSR example
```javascript
const http = require("http");
const { render, createHtml } = require("srender");
const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  render(
    () => {
      const html = createHtml();
      html`
        <!DOCTYPE html>
        <html>
          <head>
            <title>srender demo</title>
          </head>
          <body>
            Hello!
          </body>
        </html>
      `;
    },
    {
      onData: (data) => res.write(data),
    }
  );

  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

## IDE plugins
Install [lit-html IDE plugins](https://lit-html.polymer-project.org/guide/tools#ide-plugins) to have syntax highlight.

## License
MIT
