import { useState } from 'react';
import { MapPin, Navigation, Search, Package, Truck, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProducts } from '@/mock/data';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const cities = ['Mumbai, MH', 'Pune, MH', 'Thane, MH', 'Nashik, MH', 'Nagpur, MH'];

const dealerLocations = [
  { id: '1', name: 'WoodCraft Supply Co.', address: '12 Industrial Estate, Andheri East', city: 'Mumbai, MH', distance: '5.2 km', phone: '+91 98765 11111', hours: '9 AM – 7 PM', lat: 19.12, lng: 72.85, products: ['1', '2', '4', '5', '7'] },
  { id: '2', name: 'TimberLand Distributors', address: '45 MIDC, Hinjewadi Phase 2', city: 'Pune, MH', distance: '12.8 km', phone: '+91 98765 22222', hours: '8 AM – 6 PM', lat: 18.59, lng: 73.74, products: ['1', '2', '3', '5', '6', '8'] },
  { id: '3', name: 'GreenWood Depot', address: '78 Wagle Estate, Thane West', city: 'Thane, MH', distance: '8.1 km', phone: '+91 98765 33333', hours: '10 AM – 8 PM', lat: 19.20, lng: 72.96, products: ['2', '3', '4', '7'] },
  { id: '4', name: 'Royal Timber House', address: '23 Bandra Kurla Complex', city: 'Mumbai, MH', distance: '3.5 km', phone: '+91 98765 44444', hours: '9 AM – 9 PM', lat: 19.06, lng: 72.87, products: ['1', '3', '5', '6', '7', '8'] },
  { id: '5', name: 'EcoPanel Traders', address: '56 Kothrud, Near MIT College', city: 'Pune, MH', distance: '15.2 km', phone: '+91 98765 55555', hours: '8 AM – 5 PM', lat: 18.51, lng: 73.81, products: ['1', '2', '5', '6'] },
];

const stockForDealer = (dealerId: string, productId: string): { status: 'in_stock' | 'limited_stock' | 'out_of_stock'; count: number } => {
  const hash = (parseInt(dealerId) * 7 + parseInt(productId) * 13) % 100;
  if (hash < 60) return { status: 'in_stock', count: 20 + hash };
  if (hash < 85) return { status: 'limited_stock', count: 2 + (hash % 8) };
  return { status: 'out_of_stock', count: 0 };
};

const statusConfig = {
  in_stock: { label: 'In Stock', class: 'bg-success/10 text-success border-success/20' },
  limited_stock: { label: 'Limited', class: 'bg-warning/10 text-warning border-warning/20' },
  out_of_stock: { label: 'Out of Stock', class: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function AvailabilityPage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAutoDetect = () => {
    setDetecting(true);
    setTimeout(() => {
      setSelectedCity('Mumbai, MH');
      setDetecting(false);
    }, 1200);
  };

  const filteredDealers = dealerLocations.filter(d => {
    if (selectedCity && d.city !== selectedCity) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) && !d.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeDealer = dealerLocations.find(d => d.id === selectedDealer);

  return (
    <div className="container py-6">
      <h1 className="font-heading text-2xl font-bold mb-1">Check Availability</h1>
      <p className="text-sm text-muted-foreground mb-6">Find products at dealers near you</p>

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
        {/* Map view */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="relative aspect-[16/10] bg-muted">
              {/* Simulated map */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5">
                <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid lines */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="hsl(var(--border))" strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="hsl(var(--border))" strokeWidth="0.5" />
                  ))}
                  {/* Roads */}
                  <path d="M100,250 Q300,200 500,250 T800,220" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                  <path d="M400,0 Q380,200 420,500" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                  <path d="M0,350 Q200,300 400,350 T800,380" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
                  {/* Dealer pins */}
                  {filteredDealers.map((dealer, i) => {
                    const x = 100 + (i * 150) % 600;
                    const y = 80 + (i * 120) % 350;
                    const isActive = selectedDealer === dealer.id;
                    return (
                      <g key={dealer.id} onClick={() => setSelectedDealer(dealer.id)} className="cursor-pointer">
                        <circle cx={x} cy={y} r={isActive ? 20 : 14} fill={isActive ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.7)'} className="transition-all duration-200" />
                        <circle cx={x} cy={y} r={isActive ? 24 : 0} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity={isActive ? 0.4 : 0} className="transition-all duration-200" />
                        <text x={x} y={y + 4} textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="11" fontWeight="600">{i + 1}</text>
                        {isActive && (
                          <g>
                            <rect x={x - 70} y={y - 52} width="140" height="28" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                            <text x={x} y={y - 34} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="500">{dealer.name}</text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              {/* Map label */}
              <div className="absolute top-3 left-3 rounded-lg bg-card/90 backdrop-blur-sm border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3 w-3 inline mr-1" />
                {selectedCity || 'All locations'} · {filteredDealers.length} dealers
              </div>
            </div>
          </div>

          {/* Product availability for selected dealer */}
          {activeDealer && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading font-semibold text-lg">{activeDealer.name}</h3>
                  <p className="text-sm text-muted-foreground">{activeDealer.address}, {activeDealer.city}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeDealer.phone} · {activeDealer.hours}</p>
                </div>
                <Badge variant="outline" className="shrink-0">{activeDealer.distance}</Badge>
              </div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Product Availability</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {activeDealer.products.map(pid => {
                  const product = mockProducts.find(p => p.id === pid);
                  if (!product) return null;
                  const stock = stockForDealer(activeDealer.id, pid);
                  const cfg = statusConfig[stock.status];
                  return (
                    <Link
                      key={pid}
                      to={`/product/${pid}`}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{stock.count > 0 ? `${stock.count} units` : 'Unavailable'}</p>
                      </div>
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${cfg.class}`}>{cfg.label}</Badge>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Dealer list */}
        <div className="lg:col-span-2 order-1 lg:order-2 space-y-3">
          <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider">Dealers ({filteredDealers.length})</h3>
          {filteredDealers.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No dealers found for this location
            </div>
          )}
          {filteredDealers.map((dealer, i) => (
            <motion.button
              key={dealer.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedDealer(dealer.id)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                selectedDealer === dealer.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                    selectedDealer === dealer.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm">{dealer.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{dealer.address}</p>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 shrink-0 mt-1 transition-transform ${selectedDealer === dealer.id ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{dealer.distance}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{dealer.hours}</span>
                <span className="flex items-center gap-1"><Package className="h-3 w-3" />{dealer.products.length} products</span>
              </div>
              {selectedDealer === dealer.id && (
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-xs">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  <span className="text-muted-foreground">Est. delivery: <span className="font-medium text-foreground">2-4 business days</span></span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
