import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { 
  FaFutbol, 
  FaCoins, 
  FaBars, 
  FaGamepad, 
  FaUsers, 
  FaShoppingCart, 
  FaSyncAlt 
} from 'react-icons/fa';

const Header = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Helper function to determine if a link is active
  const isActive = (path: string) => location === path;

  return (
    <header className="bg-gradient-to-r from-primary to-blue-500 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <FaFutbol className="text-yellow-400 text-3xl mr-3" />
              <h1 className="text-2xl md:text-3xl font-title text-white">FUT DRAFT SPIN</h1>
            </div>
          </Link>
        </div>
        
        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6">
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/spin">
                  <div className={`text-white hover:text-yellow-400 transition cursor-pointer ${isActive('/spin') ? 'font-bold text-yellow-400' : ''}`}>
                    <div className="flex flex-col items-center">
                      <FaSyncAlt className="mb-1" />
                      <span className="text-sm">Spin</span>
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/collection">
                  <div className={`text-white hover:text-yellow-400 transition cursor-pointer ${isActive('/collection') ? 'font-bold text-yellow-400' : ''}`}>
                    <div className="flex flex-col items-center">
                      <FaUsers className="mb-1" />
                      <span className="text-sm">Collection</span>
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/team-battle">
                  <div className={`text-white hover:text-yellow-400 transition cursor-pointer ${isActive('/team-battle') ? 'font-bold text-yellow-400' : ''}`}>
                    <div className="flex flex-col items-center">
                      <FaGamepad className="mb-1" />
                      <span className="text-sm">Team Battle</span>
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/shop">
                  <div className={`text-white hover:text-yellow-400 transition cursor-pointer ${isActive('/shop') ? 'font-bold text-yellow-400' : ''}`}>
                    <div className="flex flex-col items-center">
                      <FaShoppingCart className="mb-1" />
                      <span className="text-sm">Shop</span>
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center mr-2 bg-black/20 rounded-full px-3 py-1">
              <FaCoins className="text-yellow-400 mr-1" />
              <span className="text-white font-medium">{user?.coins?.toLocaleString() || 10000}</span>
            </div>
            <div className="flex items-center">
              <Avatar className="h-10 w-10 bg-yellow-400 text-primary">
                <AvatarFallback>
                  {user?.username ? getInitials(user.username) : 'G'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
          
        {/* Mobile menu trigger */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <FaBars size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-primary text-white">
            <div className="flex items-center space-x-2 mt-4 mb-6">
              <Avatar className="h-12 w-12 bg-yellow-400 text-primary">
                <AvatarFallback>
                  {user?.username ? getInitials(user.username) : 'G'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{user?.username || 'Guest'}</h3>
                <div className="flex items-center text-sm text-yellow-400">
                  <FaCoins className="mr-1" />
                  <span>{user?.coins?.toLocaleString() || 10000}</span>
                </div>
              </div>
            </div>
            
            <Separator className="bg-white/20" />
            
            <nav className="mt-6">
              <ul className="space-y-4">
                <li>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-blue-600 transition-colors">
                      <FaFutbol />
                      <span>Home</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/spin" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-blue-600 transition-colors">
                      <FaSyncAlt />
                      <span>Spin</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/collection" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-blue-600 transition-colors">
                      <FaUsers />
                      <span>Collection</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/team-battle" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-blue-600 transition-colors">
                      <FaGamepad />
                      <span>Team Battle</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-blue-600 transition-colors">
                      <FaShoppingCart />
                      <span>Shop</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
