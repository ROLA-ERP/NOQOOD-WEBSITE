import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-x py-24 text-center">
      <h1 className="text-5xl font-extrabold text-navy-900">404</h1>
      <p className="mt-4 text-lg text-ink-700">الصفحة غير موجودة · Page not found</p>
      <div className="mt-8 flex justify-center gap-3"><Link href="/ar" className="btn btn-primary">الرئيسية</Link><Link href="/en" className="btn btn-outline">Home</Link></div>
    </section>
  );
}
