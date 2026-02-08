import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Navigation, Search, Package, Truck, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { productService } from '@/services';
import { locationService } from '@/services/locationService';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const cities = ['Mumbai, MH', 'Pune, MH', 'Delhi, DL', 'Bangalore, KA', 'Chennai, TN'];

const statusConfig = {
  in_stock: { label: 'In Stock', class: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  limited_stock: { label: 'Limited', class: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  out_of_stock: { label: 'Out of Stock', class: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function AvailabilityPage() {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: locations, isLoading: locLoading } = useQuery({
    queryKey: ['buyer-locations'],
    queryFn: locationService.getAll
  });

  const dealers = locations?.filter(l => l.type === 'dealer') || [];

  const { data: dealerProducts, isLoading: prodLoading } = useQuery({
    queryKey: ['dealer-products-availability', selectedDealerId],
    queryFn: () => productService.getProducts(), // In real app, pass dealer locationId to filter
    enabled: !!selectedDealerId
  });

  const handleAutoDetect = () => {
    setDetecting(true);
    setTimeout(() => {
      setSelectedCity('Mumbai, MH');
      setDetecting(false);
    }, 1200);
  };

  const filteredDealers = dealers.filter(d => {
    if (selectedCity && !d.address.includes(selectedCity.split(',')[0])) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) && !d.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeDealer = dealers.find(d => d.id === selectedDealerId);

  return (
    <div className="container py-6">
      <h1 className="font-heading text-2xl font-bold mb-1">Check Availability</h1>
      <p className="text-sm text-muted-foreground mb-6">Find products at authorized dealers in your network</p>

      {/* Location selector */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="pl-9"><SelectValue placeholder="Select your city" /></SelectTrigger>
            <SelectContent>
              {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleAutoDetect} disabled={detecting}>
          <Navigation className={`h-4 w-4 mr-1.5 ${detecting ? 'animate-spin' : ''}`} />
          {detecting ? 'Detecting...' : 'Auto-detect'}
        </Button>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search dealers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Map view (Placeholder Illustration) */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="relative aspect-[16/10] bg-muted">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5">
                <svg viewBox="0 0 800 500" className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="hsl(var(--border))" strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="hsl(var(--border))" strokeWidth="0.5" />
                  ))}
                  {/* Dealer pins */}
                  {filteredDealers.map((dealer, i) => {
                    const x = 100 + (i * 120) % 600;
                    const y = 80 + (i * 100) % 350;
                    const isActive = selectedDealerId === dealer.id;
                    return (
                      <g key={dealer.id} onClick={() => setSelectedDealerId(dealer.id)} className="cursor-pointer">
                        <circle cx={x} cy={y} r={isActive ? 18 : 12} fill={isActive ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.6)'} className="transition-all" />
                        <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{i + 1}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 backdrop-blur border px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Network Map View
              </div>
            </div>
          </div>

          {/* Product availability for selected dealer */}
          <AnimatePresence>
            {activeDealer && (
                <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="mt-4 rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                <div className="flex items-start justify-between mb-6">
                    <div>
                    <h3 className="font-heading font-bold text-xl text-primary">{activeDealer.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{activeDealer.address}</p>
                    <div className="flex gap-3 mt-3">
                        <Badge variant="secondary" className="text-[10px] uppercase">9 AM – 7 PM</Badge>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold">Authorized Dealer</Badge>
                    </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedDealerId(null)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Available at this location</h4>
                        {prodLoading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                        {dealerProducts?.slice(0, 6).map((p: any) => {
                        const status = p.stockCount > 0 ? 'in_stock' : 'out_of_stock';
                        const cfg = statusConfig[status as keyof typeof statusConfig];
                        return (
                            <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            className="flex items-center justify-between rounded-xl border border-border p-3 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                            >
                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{p.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-medium">{p.sku}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-xs font-bold mb-1">₹{p.price}</p>
                                <Badge className={`text-[9px] h-4 px-1 ${cfg.class}`}>{cfg.label}</Badge>
                            </div>
                            </Link>
                        );
                        })}
                    </div>
                    {dealerProducts && dealerProducts.length > 6 && (
                        <Button variant="link" className="w-full text-xs text-muted-foreground underline" asChild>
                            <Link to="/products">View full catalog</Link>
                        </Button>
                    )}
                </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dealer list */}
        <div className="lg:col-span-2 order-1 lg:order-2 space-y-3">
          <h3 className="font-heading font-bold text-xs text-muted-foreground uppercase tracking-widest mb-4">Nearby Dealers ({filteredDealers.length})</h3>
          
          {locLoading ? (
              <div className="py-10 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mb-2" />
                  <p className="text-xs">Finding dealers...</p>
              </div>
          ) : filteredDealers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>No dealers found matching your selection.</p>
            </div>
          ) : (
            filteredDealers.map((dealer, i) => (
                <motion.button
                key={dealer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedDealerId(dealer.id)}
                className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selectedDealerId === dealer.id
                    ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20'
                    : 'border-border bg-card hover:border-primary/20 hover:shadow-md'
                }`}
                >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 ${
                        selectedDealerId === dealer.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                        {i + 1}
                    </div>
                    <div>
                        <p className="font-heading font-bold text-sm">{dealer.name}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{dealer.address}</p>
                    </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 mt-1 transition-transform ${selectedDealerId === dealer.id ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                </div>
                
                <div className="flex items-center gap-4 mt-4 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/80">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary/60" /> Nearest</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-emerald-500/60" /> Open Now</span>
                </div>

                {selectedDealerId === dealer.id && (
                    <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-2 text-[11px] text-primary font-medium">
                    <Truck className="h-3.5 w-3.5" />
                    <span>Free Delivery Available</span>
                    </div>
                )}
                </motion.button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
}