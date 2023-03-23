import { Header } from '@/site/features/Header';
import { User } from '@/site/features/User';
import { HonoContext } from '@/site';
import { Layout } from '@/site/pages/Layout';
import { QA } from '@/site/features/QA';

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
