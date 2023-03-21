import { currentUser as user } from '$';
export function Header() {
  return (
    <header>
      <h1>ツイ救援プロジェクト</h1>
      <p>ツイ救援をオープンにするためのプロジェクト</p>
      {!user && <a href="/auth/login">Twitterアカウントでログイン</a>}
      {user && <a href="/auth/logout">ログアウト</a>}
    </header>
  );
}
