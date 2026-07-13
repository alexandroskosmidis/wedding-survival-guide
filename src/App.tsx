import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import {
  AlertCircle,
  MapPin,
  Star,
  Phone,
  Car,
  Scissors,
  Heart,
  Utensils,
  Sparkles,
  Music,
  Camera,
  Stethoscope,
} from "lucide-react";


import heroDrama from "@/assets/hero-drama.jpg";

const announcement = {
  active: true,
  message: "Καλώς ήρθατε στη Δράμα! Ο οδηγός επιβίωσης είναι εδώ για εσάς!",
};

type TimelineItem = {
  time: string;
  title: string;
  location: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  status: "past" | "current" | "upcoming";
};

const timeline: TimelineItem[] = [
  { time: "17:30", title: "Άφιξη Καλεσμένων", location: "Στο σπίτι μας, θα το βρείτε στα locations", icon: Sparkles, status: "past" },
  { time: "18:00", title: "Μυστήριο", location: "Ιερός Ναός Αγίου Χρυσοστόμου", icon: Heart, status: "current" },
  { time: "19:00", title: "Photo shooting", location: "Ιερός Ναός Αγίου Χρυσοστόμου", icon: Camera, status: "upcoming" },
  { time: "20:00", title: "Δεξίωση & Δείπνο", location: "Αίθουσα Δεξιώσεων Λούκουλος", icon: Utensils, status: "upcoming" },
  { time: "21:00", title: "Coctail Hour", location: "Αίθουσα Δεξιώσεων Λούκουλος", icon: MapPin, status: "upcoming" },
  { time: "22:00", title: "Πάρτι", location: "Αίθουσα Δεξιώσεων Λούκουλος", icon: Music, status: "upcoming" },
];

type Contact = {
  name: string;
  role: string;
  phone: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const contacts: Contact[] = [
  { name: "Ραδιοταξί Δράμας", role: "Μετακινήσεις 24/7", phone: "+302521022222", icon: Car },
  { name: "Hair Studio", role: "Κομμωτήριο", phone: "+302521033333", icon: Scissors },
  { name: "Νοσοκομείο Δράμας", role: "Επείγοντα", phone: "+302521350000", icon: Stethoscope },
];

// Το Interface της Βάσης Δεδομένων μας
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

/* ---------------- Small UI atoms ---------------- */

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/80">
      <Star className="h-3.5 w-3.5 fill-accent text-accent" strokeWidth={1.5} />
      {value.toFixed(1)}
    </span>
  );
}

function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-background/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/70 backdrop-blur">
      {label}
    </span>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sage">{eyebrow}</p>
      <h2 className="mt-3 text-4xl text-foreground sm:text-5xl">{title}</h2>
    </div>
  );
}

/* ---------------- Main App Component ---------------- */

export default function App() {
  const [showBanner, setShowBanner] = useState(announcement.active);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetching data από την Supabase
  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .order('title', { ascending: true });
        
        if (error) throw error;
        if (data) setLocations(data);
      } catch (error) {
        console.error('Σφάλμα κατά τη φόρτωση:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Φόρτωση...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Announcement banner */}
      {showBanner && (
        <div className="sticky top-0 z-50 border-b border-amber-soft/60 bg-amber-soft/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-terracotta" />
            </span>
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-soft-foreground" strokeWidth={1.75} />
            <p className="min-w-0 flex-1 truncate text-xs font-medium text-amber-soft-foreground sm:text-sm">
              {announcement.message}
            </p>
            <button
              onClick={() => setShowBanner(false)}
              className="shrink-0 rounded-full px-2 py-1 text-[11px] font-medium text-amber-soft-foreground/70 transition-colors hover:text-amber-soft-foreground"
            >
              Κλείσιμο
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroDrama}
            alt="Drama background"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="mx-auto max-w-3xl px-6 pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
          <p className="mb-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-sage">
            <span className="h-px w-6 bg-sage/60" />
            ΗΛΙΑΣ & ΚΑΤΕΡΙΝΑ · ΣΕΠΤΕΜΒΡΙΟΣ 2026
            <span className="h-px w-6 bg-sage/60" />
          </p>
          <h1 className="text-5xl leading-[1.05] text-foreground sm:text-7xl">
            Survival <em className="font-medium italic text-terracotta">Guide</em>
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.4em] text-muted-foreground sm:text-base">
            Δράμα · Ελλάδα
          </p>
          <div className="mx-auto my-8 h-px w-16 bg-border" />
          <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Όλα όσα χρειάζεστε για το Σαββατοκύριακο — το πρόγραμμα, τα αγαπημένα μας σημεία στην πόλη και χρήσιμα τηλέφωνα.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-24 px-4 pb-24 sm:px-6 sm:space-y-32">
        {/* Timeline */}
        <section>
          <SectionHeading eyebrow="The Day" title="Wedding Timeline" />
          <div className="relative mt-12 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)] sm:p-10">
            <ol className="relative">
              <span className="absolute left-[19px] top-2 bottom-2 w-px bg-border sm:left-[23px]" aria-hidden />
              {timeline.map((item) => {
                const Icon = item.icon;
                const isCurrent = item.status === "current";
                const isPast = item.status === "past";
                return (
                  <li key={item.time} className="relative flex gap-5 pb-8 last:pb-0 sm:gap-6">
                    <div
                      className={[
                        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all sm:h-12 sm:w-12",
                        isCurrent
                          ? "border-transparent bg-primary text-primary-foreground shadow-[0_0_0_6px_oklch(0.55_0.045_140/0.12)]"
                          : isPast
                          ? "border-border bg-background text-muted-foreground/60"
                          : "border-border bg-background text-foreground/70",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span
                          className={[
                            "font-serif text-2xl sm:text-3xl",
                            isCurrent ? "text-terracotta" : isPast ? "text-muted-foreground/60" : "text-foreground",
                          ].join(" ")}
                        >
                          {item.time}
                        </span>
                      </div>
                      <h3 className={["mt-1 text-lg sm:text-xl", isPast ? "text-muted-foreground/70" : "text-foreground"].join(" ")}>
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.location}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Locations (DYNAMIC SUPABASE DATA) */}
        <section>
          <SectionHeading eyebrow="Between Events" title="Εξερευνήστε τη Δράμα" />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <article
                key={loc.id}
                className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)]"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={loc.image_url || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop'} // Fallback εικόνα
                    alt={loc.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4">
                    <CategoryBadge label={loc.category} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl text-foreground">{loc.title}</h3>
                    {loc.stars_in_google && <StarRating value={loc.stars_in_google} />}
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{loc.description}</p>
                  
                  {/* Universal Link για Google Maps */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-all duration-300 hover:opacity-90"
                  >
                    <MapPin className="h-4 w-4" strokeWidth={1.75} />
                    Οδηγίες
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SOS Contacts */}
        <section>
          <SectionHeading eyebrow="Just in Case" title="Χρήσιμα Τηλέφωνα" />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contacts.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.name}
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-3xl bg-card p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lifted)] sm:p-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground/70">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base text-foreground sm:text-lg">{c.name}</h3>
                    <p className="truncate text-xs text-muted-foreground sm:text-sm">{c.role}</p>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    aria-label={`Call ${c.name}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:opacity-95"
                  >
                    <Phone className="h-4 w-4" strokeWidth={2} />
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-10 text-center">
          <p className="font-serif text-2xl italic text-terracotta">Enjoy every moment.</p>
          <p className="mt-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            With love, from Drama
          </p>
        </footer>
      </main>
    </div>
  );
}