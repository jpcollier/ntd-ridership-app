import Link from 'next/link';

export function Nav() {
  return (
    <nav className="nav">
      <div className="brand">NTD Ridership MVP</div>
      <div className="navLinks">
        <Link href="/">Explore</Link>
        <Link href="/compare">Compare</Link>
        <Link href="/table">Data table</Link>
      </div>
    </nav>
  );
}
