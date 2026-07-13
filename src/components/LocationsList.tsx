import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Ορισμός του Interface για πλήρη υποστήριξη TypeScript
interface Location {
  id: string;
  title: string;
  description: string | null;
  category: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  stars_in_google: number | null;
  address: string | null;
}

export default function LocationsList() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getLocations() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .order('title', { ascending: true }); // Ταξινόμηση αλφαβητικά

        if (error) throw error;
        if (data) setLocations(data);
      } catch (error) {
        console.error('Σφάλμα κατά τη φόρτωση των τοποθεσιών:', error);
      } finally {
        setLoading(false);
      }
    }

    getLocations();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>Φόρτωση οδηγού επιβίωσης...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.subtitle}>Survival Guide</h2>
        <h1 style={styles.title}>Εξερευνήστε τη Δράμα</h1>
        <p style={styles.description}>Μερικές προτάσεις για τη διαμονή σας στην πόλη.</p>
      </header>

      <div style={styles.grid}>
        {locations.map((loc) => (
          <div key={loc.id} style={styles.card}>
            {loc.image_url && (
              <img src={loc.image_url} alt={loc.title} style={styles.cardImage} />
            )}
            <div style={styles.cardBody}>
              <div style={styles.categoryBadge}>
                {loc.category.toUpperCase()}
              </div>
              <h3 style={styles.cardTitle}>{loc.title}</h3>
              
              {loc.stars_in_google && (
                <div style={styles.rating}>
                  ⭐ {loc.stars_in_google} / 5 στο Google
                </div>
              )}
              
              <p style={styles.cardText}>{loc.description}</p>
              
              {loc.address && (
                <p style={styles.addressText}>📍 {loc.address}</p>
              )}

              {/* Universal Link για οδηγίες στο Google Maps βάσει ακριβών συντεταγμένων */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.mapButton}
              >
                Οδηγίες Χάρτη
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Minimal CSS-in-JS Styles για καθαρή και κομψή εμφάνιση
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#333',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '300',
    margin: '10px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '0.9rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    color: '#8c7863', // Γήινος, minimal τόνος γάμου
    margin: 0,
  },
  description: {
    color: '#666',
    fontWeight: '300',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '30px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eaeaea',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  cardImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover' as const,
  },
  cardBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
  },
  categoryBadge: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#8c7863',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '1.3rem',
    margin: '0 0 10px 0',
    fontWeight: '500',
  },
  rating: {
    fontSize: '0.85rem',
    color: '#777',
    marginBottom: '12px',
  },
  cardText: {
    fontSize: '0.95rem',
    color: '#555',
    lineHeight: '1.5',
    marginBottom: '16px',
    flexGrow: 1,
  },
  addressText: {
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '20px',
  },
  mapButton: {
    display: 'block',
    textAlign: 'center' as const,
    background: '#333',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'background 0.2s',
  },
};