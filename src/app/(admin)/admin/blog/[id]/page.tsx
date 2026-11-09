import { notFound } from 'next/navigation';
import { guard } from '@/lib/admin';
import { db } from '@/lib/db';
import type { PostRow } from '@/lib/content';
import { Flash, H1 } from '@/components/AdminBits';
import PostForm from '@/components/PostForm';

export const dynamic = 'force-dynamic';

export default function EditPost({ params, searchParams }: { params: { id: string }; searchParams: { msg?: string } }) {
  const u = guard('blog');
  const post = db().prepare('SELECT * FROM posts WHERE id = ?').get(Number(params.id)) as unknown as PostRow | undefined;
  if (!post) notFound();
  return (<><H1>Edit article</H1><Flash msg={searchParams.msg} /><PostForm csrf={u.csrf} post={post} /></>);
}
