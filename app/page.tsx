'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Feature = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

type Testimonial = {
  name: string;
  text: string;
};

const styles = {
  body: {
    margin: 0,
    fontFamily: 'Arial, sans-serif',
    background: '#000',
    color: '#fff'
  } as React.CSSProperties,

  navbar: {
    position: 'sticky',
    top: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    background: '#111',
    borderBottom: '1px solid #333',
    zIndex: 1000
  } as React.CSSProperties,

  navLinks: {
    display: 'flex',
    gap: '15px'
  } as React.CSSProperties,

  navButton: {
    background: 'none',
    color: '#fff',
    border: '1px solid #fff',
    padding: '5px 15px',
    cursor: 'pointer',
    fontWeight: 'bold'
  } as React.CSSProperties,

  hero: {
    textAlign: 'center',
    padding: '100px 20px'
  } as React.CSSProperties,

  heroTitle: {
    fontSize: '3rem',
    marginBottom: '20px'
  } as React.CSSProperties,

  heroText: {
    color: '#ccc',
    maxWidth: '600px',
    margin: '0 auto 30px auto'
  } as React.CSSProperties,

  heroButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  } as React.CSSProperties,

  buttonPrimary: {
    background: '#fff',
    color: '#000',
    padding: '10px 25px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  } as React.CSSProperties,

  buttonSecondary: {
    background: 'none',
    border: '1px solid #fff',
    color: '#fff',
    padding: '10px 25px',
    cursor: 'pointer',
    fontWeight: 'bold'
  } as React.CSSProperties,

  section: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  } as React.CSSProperties,

  sectionTitle: {
    textAlign: 'center',
    fontSize: '2.2rem',
    marginBottom: '50px'
  } as React.CSSProperties,

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
    gap: '20px'
  } as React.CSSProperties,

  card: {
    background: '#1f1f1f',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #333',
    borderRadius: '8px',
    transition: '0.3s'
  } as React.CSSProperties,

  cardHover: {
    transform: 'translateY(-6px)'
  } as React.CSSProperties,

  cardIcon: {
    fontSize: '40px',
    marginBottom: '15px'
  } as React.CSSProperties,

  testimonialText: {
    color: '#bbb',
    margin: '10px 0'
  } as React.CSSProperties,

  footer: {
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid #333',
    color: '#aaa'
  } as React.CSSProperties,

  mobileNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0',
    background: '#111',
    borderTop: '1px solid #333',
    zIndex: 1000
  } as React.CSSProperties,

  mobileNavButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '0.9rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    cursor: 'pointer'
  } as React.CSSProperties,

  icon: {
    fontSize: '1.5rem',
    marginBottom: '2px'
  } as React.CSSProperties
};

const HomeIcon = () => <span style={styles.icon}>🏠</span>;
const FeaturesIcon = () => <span style={styles.icon}>📦</span>;
const TestimonialsIcon = () => <span style={styles.icon}>⭐</span>;
const LoginIcon = () => <span style={styles.icon}>🔑</span>;
const StorageIcon = () => <span style={styles.icon}>🗄️</span>;
const InsightsIcon = () => <span style={styles.icon}>📊</span>;
const AlertsIcon = () => <span style={styles.icon}>⚠️</span>;

const LandingPage: React.FC = () => {

  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features: Feature[] = [
    {
      icon: <StorageIcon />,
      title: 'Smart Inventory',
      text: 'Manage products and track stock levels in real time.'
    },
    {
      icon: <InsightsIcon />,
      title: 'Analytics Dashboard',
      text: 'Visual reports to analyze inventory performance.'
    },
    {
      icon: <AlertsIcon />,
      title: 'Low Stock Alerts',
      text: 'Get alerts automatically when items run low.'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Rahul Sharma',
      text: 'This system helped us track inventory across warehouses easily.'
    },
    {
      name: 'Anita Verma',
      text: 'Clean interface and powerful analytics for our business.'
    },
    {
      name: 'Mohit Jain',
      text: 'Reduced stock mistakes and saved a lot of time.'
    }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={styles.body}>

      {/* Desktop Navbar */}

      {!isMobile && (
        <nav style={styles.navbar}>

          <div style={{ fontWeight: 'bold' }}>StockFlow</div>

          <div style={styles.navLinks}>

            <button style={styles.navButton} onClick={() => scrollTo('home')}>
              Home
            </button>

            <button style={styles.navButton} onClick={() => scrollTo('features')}>
              Features
            </button>

            <button style={styles.navButton} onClick={() => scrollTo('testimonials')}>
              Testimonials
            </button>

            <button
              style={styles.navButton}
              onClick={() => router.push('/login')}
            >
              Login
            </button>

          </div>

        </nav>
      )}

      {/* Hero Section */}

      <section id="home" style={styles.hero}>

        <h1 style={styles.heroTitle}>
          Modern Inventory Management
        </h1>

        <p style={styles.heroText}>
          Track products, monitor stock, and manage inventory efficiently using a powerful and simple dashboard.
        </p>

        <div style={styles.heroButtons}>

          <button
            style={styles.buttonPrimary}
            onClick={() => router.push('/login')}
          >
            Get Started
          </button>

          <button
            style={styles.buttonSecondary}
            onClick={() => scrollTo('features')}
          >
            Learn More
          </button>

        </div>

      </section>

      {/* Features */}

      <section id="features" style={styles.section}>

        <h2 style={styles.sectionTitle}>Features</h2>

        <div style={styles.featuresGrid}>

          {features.map((f, i) => (

            <div
              key={i}
              style={{
                ...styles.card,
                ...(hovered === i ? styles.cardHover : {})
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >

              <div style={styles.cardIcon}>{f.icon}</div>

              <h3>{f.title}</h3>

              <p style={styles.testimonialText}>{f.text}</p>

            </div>

          ))}

        </div>

      </section>

      {/* Testimonials */}

      <section id="testimonials" style={styles.section}>

        <h2 style={styles.sectionTitle}>
          What Our Users Say
        </h2>

        <div style={styles.featuresGrid}>

          {testimonials.map((t, i) => (

            <div key={i} style={styles.card}>

              <p style={styles.testimonialText}>
                "{t.text}"
              </p>

              <strong>{t.name}</strong>

            </div>

          ))}

        </div>

      </section>

      {/* Footer */}

      <footer style={styles.footer}>
        © 2026 StockFlow Inventory Platform
      </footer>

      {/* Mobile Navbar */}

      {isMobile && (

        <div style={styles.mobileNav}>

          <button
            style={styles.mobileNavButton}
            onClick={() => scrollTo('home')}
          >
            <HomeIcon />
            Home
          </button>

          <button
            style={styles.mobileNavButton}
            onClick={() => scrollTo('features')}
          >
            <FeaturesIcon />
            Features
          </button>

          <button
            style={styles.mobileNavButton}
            onClick={() => scrollTo('testimonials')}
          >
            <TestimonialsIcon />
            Testimonials
          </button>

          <button
            style={styles.mobileNavButton}
            onClick={() => router.push('/login')}
          >
            <LoginIcon />
            Login
          </button>

        </div>

      )}

    </div>
  );
};

export default LandingPage;