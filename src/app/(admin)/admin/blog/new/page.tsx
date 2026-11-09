import { guard } from '@/lib/admin';
import { Flash, H1 } from '@/components/AdminBits';
import PostForm from '@/components/PostForm';

export const dynamic = 'force-dynamic';

export default function NewPost({ searchParams }: { searchParams: { msg?: string } }) {
  const u = guard('blog');
  return (<><H1>New article</H1><Flash msg={searchParams.msg} /><PostForm csrf={u.csrf} /></>);
}
