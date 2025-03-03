import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'UT Campus Connect',
  description: 'University of Toledo Lost and Found System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          {children}
        </main>
        <footer style={{ backgroundColor: 'var(--primary-blue)', color: 'white', padding: '1rem 0', textAlign: 'center' }}>
          <div className="container">
            <p>© {new Date().getFullYear()} University of Toledo Campus Connect</p>
          </div>
        </footer>
      </body>
    </html>
  );
} 