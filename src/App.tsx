import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import {
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
  Clapperboard,
} from "lucide-react";


import heroDrama from "@/assets/hero-drama.jpg";

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
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }> | string;
};

const coupleContacts: Contact[] = [
  { name: "Ηλίας", role: "Γαμπρός", phone: "+306947018547", icon: "🤵" },
  { name: "Κατερίνα", role: "Νύφη", phone: "+306976464499", icon: "👰" },
];

const contacts: Contact[] = [
  { name: "Ραδιοταξί Δράμας", role: "Μετακινήσεις 24/7", phone: "+302521022022", icon: Car },
  { name: "Hair Studio", role: "Κομμωτήριο", phone: "+302521039452", icon: Scissors },
  { name: "Νοσοκομείο Δράμας", role: "Επείγοντα", phone: "+302521 350400", icon: Stethoscope },
];

// Το Interface της Βάσης Δεδομένων μας
interface Location {
  id: string;
  title: string;
  description: string | null;
  category: string;
  class: string;
  basic: boolean;
  icon: string | null;
  latitude: number;
  longitude: number;
  image_url: string | null;
  stars_in_google: number | null;
  address: string | null;
}

const LOCATION_CLASSES = ["Αξιοθέατα", "Καφέ", "Φαγητό", "Διασκέδαση", "Events"] as const;

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

function ContactCard({ contact }: { contact: Contact }) {
  const Icon = contact.icon;
  return (
    <div className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-3xl bg-card p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lifted)] sm:p-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground/70">
        {typeof Icon === "string" ? (
          <span className="text-xl">{Icon}</span>
        ) : (
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-base text-foreground sm:text-lg">{contact.name}</h3>
        <p className="truncate text-xs text-muted-foreground sm:text-sm">{contact.role}</p>
      </div>
      <a
        href={`tel:${contact.phone}`}
        aria-label={`Call ${contact.name}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:opacity-95"
      >
        <Phone className="h-4 w-4" strokeWidth={2} />
      </a>
    </div>
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
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeClass, setActiveClass] = useState<(typeof LOCATION_CLASSES)[number]>(LOCATION_CLASSES[0]);

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

  const basicLocations = locations.filter((loc) => loc.basic);
  const exploreLocations = locations.filter((loc) => !loc.basic);
  const filteredLocations = exploreLocations.filter((loc) => loc.class === activeClass);

  return (
    <div className="min-h-screen bg-background text-foreground">
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

        {/* Βασικές Τοποθεσίες (DYNAMIC SUPABASE DATA) */}
        <section>
          <SectionHeading eyebrow="Don't Get Lost" title="Οι βασικές μας τοποθεσίες" />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {basicLocations.map((loc) => (
              <div
                key={loc.id}
                className="group flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)] sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4 sm:contents">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl transition-transform duration-300 group-hover:scale-105">
                    {loc.icon || "📍"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg text-foreground sm:text-xl">{loc.title}</h3>
                    {loc.address && (
                      <p className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                        <span className="line-clamp-2">{loc.address}</span>
                      </p>
                    )}
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address || loc.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all duration-300 hover:opacity-90 sm:w-auto"
                >
                  <MapPin className="h-4 w-4" strokeWidth={1.75} />
                  Οδηγίες
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Locations (DYNAMIC SUPABASE DATA) */}
        <section>
          <SectionHeading eyebrow="Between Events" title="Εξερευνήστε τη Δράμα" />

          {/* Class filter tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {LOCATION_CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={[
                  "rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-300",
                  activeClass === cls
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground/70 hover:bg-secondary/70",
                ].join(" ")}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Festival note (μόνο στο tab "Events") */}
          {activeClass === "Events" && (
            <div className="mt-8 flex items-start gap-4 rounded-3xl bg-secondary/60 p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-terracotta/15 text-terracotta">
                <Clapperboard className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
                Το <span className="font-medium text-foreground">49ο Διεθνές Φεστιβάλ Ταινιών Μικρού Μήκους Δράμας</span> θα
                πραγματοποιηθεί από τις <span className="font-medium text-foreground">6 έως τις 12 Σεπτεμβρίου 2026</span>.
                Οι προβολές και οι εκδηλώσεις θα φιλοξενηθούν στους δύο παρακάτω κεντρικούς χώρους της πόλης.
              </p>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map((loc) => (
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

          {/* Τα τηλέφωνα των μελλονύμφων */}
          <p className="mt-12 text-xs font-medium uppercase tracking-[0.2em] text-sage">
            Τα τηλέφωνα των μελλονύμφων
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {coupleContacts.map((c) => (
              <ContactCard key={c.name} contact={c} />
            ))}
          </div>

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.2em] text-sage">
            Λοιπά Τηλέφωνα
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contacts.map((c) => (
              <ContactCard key={c.name} contact={c} />
            ))}
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