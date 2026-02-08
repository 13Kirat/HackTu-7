import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Bell, Search, Menu, X, Sun, Moon, User, Package, Home, MapPin, LogOut, Check } from 'lucide-react';
import { useCartStore, useUIStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '@/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TopNav() {
  const queryClient = useQueryClient();
  const { items } = useCartStore();
  const { theme, toggleTheme } = useUIStore();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const isCatalogPage = location.pathname === '/';

  // Sync search input with URL params
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
    else setSearch('');
  }, [searchParams]);

  const { data: alerts = [] } = useQuery({
    queryKey: ['buyer-alerts'],
    queryFn: alertService.getAlerts,
    refetchInterval: 30000 // Poll every 30s
  });

  const markReadMutation = useMutation({
    mutationFn: alertService.markAsRead,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['buyer-alerts'] });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
        navigate(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
        navigate('/');
    }
  };

  const navItems = [
    { to: '/', label: 'Catalog', icon: Home },
    { to: '/availability', label: 'Availability', icon: MapPin },
    { to: '/orders', label: 'Orders', icon: Package },
    { to: '/cart', label: 'Cart', icon: ShoppingCart },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;
  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Package className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">SupplyHub</span>
        </Link>

        {/* Search - Only on Catalog Page */}
        {isCatalogPage ? (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </form>
        ) : (
            <div className="flex-1 md:block hidden" /> // Spacer
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.to === '/cart' && cartCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-5 px-1 text-[10px]">{cartCount}</Badge>
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto md:ml-0">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-2 py-2 font-bold text-xs uppercase tracking-widest text-muted-foreground border-b mb-1">
                  Recent Activity
              </div>
              {alerts.length > 0 ? (
                  alerts.slice(0, 5).map(alert => (
                    <DropdownMenuItem 
                        key={alert.id} 
                        className="flex items-start gap-3 py-3 px-3 cursor-pointer group"
                        onClick={() => markReadMutation.mutate(alert.id)}
                    >
                      <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${!alert.read ? 'bg-primary' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold uppercase tracking-tight ${!alert.read ? 'text-foreground' : 'text-muted-foreground'}`}>{alert.title}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">{alert.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{alert.date}</p>
                      </div>
                      {!alert.read && <Check className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </DropdownMenuItem>
                  ))
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p>No new notifications</p>
                </div>
              )}
              {alerts.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center text-xs font-bold text-primary py-2 cursor-pointer" onClick={() => navigate('/orders')}>
                        View Order Updates
                    </DropdownMenuItem>
                  </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user && (
                <div className="px-2 py-2 bg-muted/30 rounded-t-md mb-1">
                  <p className="text-sm font-bold text-primary truncate">{user.profile.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{user.email}</p>
                </div>
              )}
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer font-medium"><User className="h-4 w-4 mr-2" /> My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/orders" className="cursor-pointer font-medium"><Package className="h-4 w-4 mr-2" /> Order History</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive font-bold">
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border animate-fade-in bg-card">
          {isCatalogPage && (
              <form onSubmit={handleSearch} className="p-3">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                </div>
            </form>
          )}
          <nav className="flex flex-col p-2">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(item.to) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.to === '/cart' && cartCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 px-1 text-[10px] ml-auto">{cartCount}</Badge>
                )}
              </Link>
            ))}
            <DropdownMenuSeparator className="my-2" />
            <button onClick={logout} className="flex items-center gap-2 px-3 py-3 text-sm font-bold text-destructive hover:bg-destructive/5 rounded-lg transition-colors">
                <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
