import { Header } from '$/features/Header';
import { User } from '$/features/User';
import { HonoContext } from '$';
import { Layout } from '$/pages/Layout';
import { QA } from '$/features/QA';

type Props = {
  count: number;
  c: HonoContext;
};
export function IndexPage({ count, c }: Props) {
  return (
    <Layout title="ツイ救援プロジェクト">
      <Header c={c} />
      <main>
        <h2 class="count">現在 {count}人が参加中です。</h2>
        <User c={c} />
        <QA />
      </main>
    </Layout>
  );
}
