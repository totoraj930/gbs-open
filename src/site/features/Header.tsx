import { HonoContext } from '..';

type Props = {
  c: HonoContext;
};
export function Header({ c }: Props) {
  const user = c.get('user');
  return (
    <header>
      <h1>ツイ救援プロジェクト</h1>
      <p>ツイ救援をオープンにするためのプロジェクト</p>
      {!user && <a href="/auth/login">Twitterアカウントでログイン</a>}
      {user && <a href="/auth/logout">ログアウト</a>}
    </header>
  );
}
