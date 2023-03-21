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
        <title>${props.title}</title>
        <link rel="stylesheet" href="/static/base.css" />
      </head>
      <body>
        ${props.children}
      </body>
    </html>
  `;
}
