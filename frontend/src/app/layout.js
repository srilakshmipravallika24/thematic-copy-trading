import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import RegulatoryBanner from '../components/RegulatoryBanner';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Thematic Social Copy-Trading Network | Regulated RIA Mirror Platform',
  description:
    'Regulated investment platform allowing retail users to follow, discuss and mirror the verified trade allocations of top-performing registered investment advisors.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <RegulatoryBanner />
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-slate-950 border-t border-slate-900 py-10 px-4 mt-20 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-slate-400">Thematic Copy-Trading Network (Regulated RIA Edition)</p>
                <p>Built with Next.js • Node.js + Express.js • MongoDB</p>
              </div>
              <div className="text-center md:text-right text-[11px] max-w-lg">
                Regulatory Notice: Copy-trading services are provided in accordance with SEC Advisers Act Section 206 and FINRA Rule 2111. All trades are simulated or executed through licensed broker-dealer clearing agents.
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
