import { currentUser as user } from '$';
import clsx from 'clsx';

export function User() {
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
