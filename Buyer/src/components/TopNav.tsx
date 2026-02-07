import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Bell, Search, Menu, X, Sun, Moon, User, Package, Home, MapPin, LogOut } from 'lucide-react';
import { useCartStore, useUIStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
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
  const { items } = useCartStore();
  const { theme, toggleTheme, alerts, setAlerts, unreadCount } = useUIStore();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    alertService.getAlerts().then(setAlerts);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  const navItems = [
    { to: '/', label: 'Catalog', icon: Home },
    { to: '/availability', label: 'Availability', icon: MapPin },
    { to: '/orders', label: 'Orders', icon: Package },
    { to: '/cart', label: 'Cart', icon: ShoppingCart },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

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

        {/* Search */}
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
                {unreadCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center px-1">
                    {unreadCount()}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {alerts.slice(0, 5).map(alert => (
                <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-0.5 py-2">
                  <span className={`text-sm font-medium ${!alert.read ? 'text-foreground' : 'text-muted-foreground'}`}>{alert.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{alert.message}</span>
                </DropdownMenuItem>
              ))}
              {alerts.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
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
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user && (
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.profile.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer"><User className="h-4 w-4 mr-2" /> Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
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
        <div className="md:hidden border-t border-border animate-fade-in">
          <form onSubmit={handleSearch} className="p-3">
            <div className="relative">
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
          <nav className="flex flex-col p-2">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.to) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.to === '/cart' && cartCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 px-1 text-[10px] ml-auto">{cartCount}</Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
