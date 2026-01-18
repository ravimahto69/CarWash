import localFont from "next/font/local";
import "./globals.css";
import "./print-styles.css";
import "antd/dist/reset.css"; // required for Ant Design
import Layout from "antd/es/layout/layout";
import Header from "./component/Header";
import Footer from "./component/Footer";
import { ThemeProvider } from "./context/ThemeContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "WashHub",
  description: "Car wash booking and payments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 transition-colors`}>
        <ThemeProvider>
          <header>
            <Header />
          </header>
          <Layout className="bg-white dark:bg-gray-900 transition-colors">
            {children}
          </Layout>
          <footer>
            <Footer />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
