import './globals.css';
import { Nav } from '@/components/Nav';

export const metadata = {
  title: 'NTD Ridership App',
  description: 'Explore monthly NTD ridership metrics.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
