import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ListChecks, CalendarDays, BookOpenText, Timer, StickyNote, Settings, LogOut,
  ChevronLeft, ChevronRight, Menu, Zap, UserCircle, MessageSquare, Sparkles, Brain, CloudSun, 
  Clock, RefreshCw, BookCopy, Link2 as LinkIconLucide, GraduationCap, FileText, BookHeart 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

const SidebarLink = ({ to, icon, children, currentPath, isSidebarCollapsed, isMobileMenuOpen, setMobileMenuOpen }) => {
  const isActive = currentPath === to || (currentPath.startsWith(to) && to !== "/dashboard" && to !== "/");
  const { theme } = useTheme();
  const activeClass = theme === 'dark' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-primary text-primary-foreground hover:bg-primary/90';
  const inactiveClass = 'text-card-foreground hover:bg-accent hover:text-accent-foreground';

  return (
    <Link 
      to={to} 
      className={`sidebar-item ${isActive ? activeClass : inactiveClass}`}
      onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
      title={isSidebarCollapsed && !isMobileMenuOpen ? children : ""}
    >
      {React.cloneElement(icon, { className: `h-5 w-5 ${isActive ? 'text-inherit' : 'text-foreground'}` })}
      <span className={`ml-3 ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'lg:hidden' : 'inline-block'}`}>{children}</span>
    </Link>
  );
};

const DashboardHomePage = () => {
  const { theme } = useTheme();
  const widgetVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  const iconColorClass = theme === 'dark' ? "text-primary" : "text-secondary"; // Mint for dark, Amber for light

  const mainFeatures = [
    { name: "Tasks", icon: <ListChecks className={`h-8 w-8 ${iconColorClass}`} />, link: "/dashboard/tasks", description: "Organize your to-do list." },
    { name: "Calendar", icon: <CalendarDays className={`h-8 w-8 ${iconColorClass}`} />, link: "/dashboard/calendar", description: "Schedule events & deadlines." },
    { name: "School", icon: <GraduationCap className={`h-8 w-8 ${iconColorClass}`} />, link: "/dashboard/school", description: "Plan school work & track assignments." },
    { name: "Notes", icon: <StickyNote className={`h-8 w-8 ${iconColorClass}`} />, link: "/dashboard/notes", description: "Jot down ideas & lecture notes." },
    { name: "Flashcards", icon: <BookCopy className={`h-8 w-8 ${iconColorClass}`} />, link: "/dashboard/flashcards", description: "Practice key concepts with SRS." },
    { name: "Journal", icon: <BookOpenText className={`h-8 w-8 ${iconColorClass}`} />, link: "/dashboard/journal", description: "Reflect and record thoughts." },
    { name: "Mindfulness", icon: <Brain className={`h-8 w-8 ${iconColorClass}`} />, link: "/dashboard/mindfulness", description: "Log your mood & well-being." },
    { name: "Resources", icon: <BookHeart className={`h-8 w-8 ${iconColorClass}`} />, link: "/dashboard/resources", description: "Access your important resources." },
    { name: "AI Chat", icon: <MessageSquare className={`h-8 w-8 ${iconColorClass}`} />, link: "/dashboard/ai-chat", description: "AI assistance for students." },
  ];
  const { user } = useAuth();
  const [quote, setQuote] = useState({ text: "Loading inspirational quote...", author: "" });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: "N/A", desc: "Weather data unavailable" });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const fetchQuote = useCallback(async () => {
    try {
      const response = await fetch("https://api.quotable.io/random?maxLength=100&tags=education|learning|wisdom|success");
      if (!response.ok) throw new Error("Failed to fetch quote");
      const data = await response.json();
      setQuote({ text: data.content, author: data.author });
    } catch (error) {
      console.error("Quote fetch error:", error);
      setQuote({ text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" });
    }
  }, []);

  useEffect(() => {
    fetchQuote();
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const storedEvents = localStorage.getItem("projectSahurCalendarEvents");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      const futureEvents = parsedEvents
        .filter(e => new Date(e.date) >= new Date(new Date().toDateString()))
        .sort((a,b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3); 
      setUpcomingEvents(futureEvents);
    }
    return () => clearInterval(timerId);
  }, [fetchQuote]);


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 min-h-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         <motion.div 
          className="lg:col-span-3 p-6 rounded-xl bg-card shadow-lg border border-border"
          initial={{ opacity:0, y: -20 }}
          animate={{ opacity:1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <CardTitle className="text-xl text-foreground mb-2">Upcoming Deadlines & Events</CardTitle>
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-2">
              {upcomingEvents.map(event => (
                <li key={event.id} className="text-sm text-muted-foreground flex justify-between items-center">
                  <span>{event.title}</span>
                  <span className="font-medium text-xs">{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming events in the next few days. Check your calendar!</p>
          )}
        </motion.div>

        <motion.div 
          className="lg:col-span-2 p-6 rounded-xl bg-card shadow-lg border border-border"
          initial={{ opacity:0, y: -20 }}
          animate={{ opacity:1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            Welcome back, {user?.email?.split('@')[0] || 'Student'}!
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-md text-muted-foreground italic">"{quote.text}"</p>
            <Button variant="ghost" size="icon" onClick={fetchQuote} className="text-muted-foreground hover:text-primary dark:hover:text-primary">
              <RefreshCw className="h-4 w-4"/>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/70 text-right mt-1">- {quote.author || "Unknown"}</p>
        </motion.div>

        <motion.div
          className="p-6 rounded-xl bg-card shadow-lg border border-border flex flex-col justify-center items-center"
          initial={{ opacity:0, y: -20 }}
          animate={{ opacity:1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={`text-4xl font-bold ${iconColorClass}`}>{format(currentTime, 'HH:mm:ss')}</div>
          <div className="text-sm text-muted-foreground">{format(currentTime, 'eeee, MMMM do yyyy')}</div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <CloudSun className={`h-4 w-4 mr-1 ${iconColorClass}`}/> {weather.temp}°C, {weather.desc}
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainFeatures.map((feature, index) => (
          <motion.div
            key={feature.name}
            custom={index}
            variants={widgetVariants}
            initial="hidden"
            animate="visible"
            className="widget-card p-0 flex flex-col group"
          >
            <Link to={feature.link} className="w-full h-full flex flex-col">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-foreground">{feature.name}</CardTitle>
                {feature.icon}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};


const DashboardPage = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  const sidebarVariants = {
    collapsed: { width: "5rem", transition: { duration: 0.3, ease: "easeInOut" } },
    expanded: { width: "16rem", transition: { duration: 0.3, ease: "easeInOut" } },
  };
  
  const mobileSidebarVariants = {
    closed: { x: "-100%", transition: { duration: 0.3, ease: "easeInOut" } },
    open: { x: "0%", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const sidebarLinks = [
    { to: "/dashboard", icon: <LayoutDashboard />, text: "Dashboard" },
    { to: "/dashboard/tasks", icon: <ListChecks />, text: "Tasks" },
    { to: "/dashboard/calendar", icon: <CalendarDays />, text: "Calendar" },
    { to: "/dashboard/school", icon: <GraduationCap />, text: "School" },
    { to: "/dashboard/flashcards", icon: <BookCopy />, text: "Flashcards" },
    { to: "/dashboard/journal", icon: <BookOpenText />, text: "Journal" },
    { to: "/dashboard/mindfulness", icon: <Brain />, text: "Mindfulness" },
    { to: "/dashboard/timer", icon: <Timer />, text: "Focus Timer" },
    { to: "/dashboard/notes", icon: <StickyNote />, text: "Notes" },
    { to: "/dashboard/resources", icon: <BookHeart />, text: "Resources" },
    { to: "/dashboard/ai-chat", icon: <MessageSquare />, text: "AI Chat" },
    { to: "/subscribe", icon: <Zap />, text: "Subscription" },
  ];

  const logoColorClass = theme === 'dark' ? 'text-primary' : 'text-primary'; // Mint in dark, Dark Blue in light
  const iconColorClass = theme === 'dark' ? 'text-primary' : 'text-secondary'; // Mint for dark, Amber for light


  const SidebarContent = ({ currentPath, setMobileMenuOpenProp }) => (
    <div className="flex flex-col h-full sidebar">
      <div className={`p-4 flex items-center border-b border-border ${isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center' : 'justify-between'}`}>
        <Link to="/dashboard" onClick={() => setMobileMenuOpenProp && setMobileMenuOpenProp(false)} className="flex items-center gap-2">
            <Sparkles className={`h-7 w-7 ${logoColorClass} ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'inline-block' : 'hidden lg:inline-block'}`} />
            <motion.span 
                className={`text-2xl font-bold ${logoColorClass} ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'hidden' : 'inline-block'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Project Sahur
            </motion.span>
        </Link>
        {!isMobileMenuOpen && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className={`hidden lg:flex text-foreground hover:bg-accent ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'hidden' : 'inline-flex'}`}>
            <ChevronLeft className="text-foreground"/>
          </Button>
        )}
      </div>
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {sidebarLinks.map(link => (
          <SidebarLink key={link.to} to={link.to} icon={link.icon} currentPath={currentPath} isSidebarCollapsed={isSidebarCollapsed} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpenProp}>
            {link.text}
          </SidebarLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <SidebarLink to="/dashboard/settings" icon={<Settings />} currentPath={currentPath} isSidebarCollapsed={isSidebarCollapsed} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpenProp}>
         Settings
        </SidebarLink>
        <button onClick={handleLogout} className="sidebar-item w-full text-card-foreground hover:bg-accent hover:text-accent-foreground">
          <LogOut className="h-5 w-5 text-foreground" />
          <span className={`ml-3 ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'lg:hidden' : 'inline-block'}`}>Logout</span>
        </button>
      </div>
    </div>
  );


  return (
    <div className="flex h-screen dashboard-bg">
      <motion.aside 
        className="hidden lg:flex flex-col"
        variants={sidebarVariants}
        initial={false}
        animate={isSidebarCollapsed ? "collapsed" : "expanded"}
      >
        <SidebarContent currentPath={location.pathname} />
      </motion.aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside 
            className="lg:hidden fixed inset-0 z-50 flex flex-col w-64"
            variants={mobileSidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <SidebarContent currentPath={location.pathname} setMobileMenuOpenProp={setMobileMenuOpen} />
          </motion.aside>
        )}
      </AnimatePresence>


      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 bg-card flex items-center justify-between shadow-md border-b border-border">
            <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={isMobileMenuOpen ? toggleMobileMenu : (isSidebarCollapsed ? toggleSidebar : toggleMobileMenu)} className="lg:hidden text-foreground hover:bg-accent mr-2">
                    <Menu className="text-foreground"/>
                </Button>
                 <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden lg:flex text-foreground hover:bg-accent mr-2">
                    {isSidebarCollapsed ? <ChevronRight className="text-foreground"/> : <ChevronLeft className="text-foreground"/>}
                </Button>
                <Link to="/dashboard" className={`text-xl font-bold ${logoColorClass} flex items-center gap-2`}>
                  <Sparkles className={`h-6 w-6 inline-block lg:hidden ${logoColorClass}`} />
                  <span className="hidden sm:inline">Project Sahur</span>
                </Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-10 w-10 p-0 text-foreground hover:bg-accent">
                    <UserCircle className="h-6 w-6 text-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground w-56">
                  <DropdownMenuLabel className="px-3 py-2">
                    <p className="font-medium">{user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem className="hover:bg-accent focus:bg-accent px-3 py-2" onSelect={() => navigate('/dashboard/settings')}>
                    <Settings className="mr-2 h-4 w-4 text-foreground" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-accent focus:bg-accent px-3 py-2" onSelect={() => navigate('/subscribe')}>
                    <Zap className="mr-2 h-4 w-4 text-foreground" />
                    <span>Subscription</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem className="hover:bg-accent focus:bg-accent text-destructive focus:text-destructive px-3 py-2" onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background">
          <AnimatePresence mode="wait">
            {children || <DashboardHomePage key={location.pathname} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;