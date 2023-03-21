import { html } from 'hono/html';

type Props = {
  title: string;
  children?: any;
};
export function Layout(props: Props) {
  return html`
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, shrink-to-fit=no" />
        <title>${props.title}</title>
        <link rel="stylesheet" href="/static/base.css" />
      </head>
      <body>
        ${props.children}
      </body>
    </html>
  `;
}
