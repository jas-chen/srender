# srender
Stream based renderer

## Features
- Tiny (only ~70 sloc)
- Component
- Context
- SSR

## Todo example
```javascript
import { createHtml, createRef, writeToNode, rawHtml } from "srender";

const root = document.getElementById("root");

const TodoItem = (html, { item }, { name }) => html`
  <li>
    ${item}_${name}
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

  return () => {
    const $form = formRef.get();
    const $input = inputRef.get();
    const $list = listRef.get();

    $form.onsubmit = e => {
      e.preventDefault();
      writeToNode(
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

writeToNode(
  () => {
    const html = createHtml({
      createRef: createRef.bind({}), // initialize createRef
      name: "root",
    });
    return html(TodoMVC, { items: ["foo", "bar"] });
  },
  node => root.appendChild(node)
);
```

## SSR example
```javascript
import http from "http";
import { write, createHtml } from "srender";
const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  write(
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
    (data) => res.write(data)
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
