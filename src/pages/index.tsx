import { Header } from '$/features/Header';
import { User } from '$/features/User';
import { HonoContext } from '$';
import { Layout } from '$/pages/Layout';
import { QA } from '$/features/QA';

type Props = {
  count: number;
};
export function IndexPage({ count }: Props) {
  return (
    <Layout title="ツイ救援プロジェクト">
      <Header />
      <main>
        <h2 class="count">現在 {count}人が参加中です。</h2>
        <User />
        <QA />
      </main>
    </Layout>
  );
}
