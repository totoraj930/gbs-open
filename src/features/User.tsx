import clsx from 'clsx';
import { HonoContext } from '..';

type Props = {
  c: HonoContext;
};
export function User({ c }: Props) {
  const user = c.get('user');
  if (!user) return <></>;
  return (
    <div>
      <p>@{user.screenName}でログイン中</p>
      <p>
        検索APIでの使用:
        {user.isActive && <span class="on">参加中です！</span>}
        {!user.isActive && <span class="off">参加していません</span>}
      </p>
      <div>
        <a
          class={clsx('btn', { cancel: user.isActive })}
          href={`/auth/toggle/${!user.isActive}`}
        >
          {user.isActive ? '参加を取り消す' : '参加する'}
        </a>
      </div>
    </div>
  );
}
