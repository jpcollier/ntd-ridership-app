import Link from 'next/link';

export function Nav() {
  return (
    <nav className="nav">
      <Link href="/">Explore</Link>
      <Link href="/compare">Compare</Link>
      <Link href="/table">Data table</Link>
    </nav>
  );
}
