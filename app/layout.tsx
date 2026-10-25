import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'FIELDNOTES | very50 企画ラボ',description:'社会起業家に会う旅を、アイデアから企画へ。' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ja"><body>{children}</body></html>}
