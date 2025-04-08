import { Inter } from 'next/font/google'
import { ThemeProvider } from './theme-provider'
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Bible en Ligne",
  description: "Une application moderne pour lire et étudier la Bible",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
