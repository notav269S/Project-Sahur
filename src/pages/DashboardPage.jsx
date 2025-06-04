
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  BookOpenText, 
  Timer, 
  StickyNote, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Zap,
  UserCircle,
  MessageSquare,
  Sparkles
} from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";


const SidebarLink = ({ to, icon, children, currentPath, isSidebarCollapsed, isMobileMenuOpen, setMobileMenuOpen }) => {
  const isActive = currentPath === to || (currentPath.startsWith(to) && to !== "/dashboard" && to !== "/");
  return (
    <Link 
      to={to} 
      className={`sidebar-item ${isActive ? 'active' : ''}`}
      onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
      title={isSidebarCollapsed && !isMobileMenuOpen ? children : ""}
    >
      {icon}
      <span className={`ml-3 ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'lg:hidden' : 'inline-block'}`}>{children}</span>
    </Link>
  );
};

const DashboardHomePage = () => {
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

  const features = [
    { name: "Tasks", icon: <CheckSquare className="h-10 w-10 text-[#ADEFD1]" />, link: "/dashboard/tasks", description: "Organize and manage your to-do list." },
    { name: "Calendar", icon: <CalendarDays className="h-10 w-10 text-[#ADEFD1]" />, link: "/dashboard/calendar", description: "Schedule events and track deadlines." },
    { name: "Journal", icon: <BookOpenText className="h-10 w-10 text-[#ADEFD1]" />, link: "/dashboard/journal", description: "Reflect and record your thoughts." },
    { name: "Timer", icon: <Timer className="h-10 w-10 text-[#ADEFD1]" />, link: "/dashboard/timer", description: "Stay focused with Pomodoro and custom timers." },
    { name: "Notes", icon: <StickyNote className="h-10 w-10 text-[#ADEFD1]" />, link: "/dashboard/notes", description: "Quickly jot down ideas and information." },
    { name: "AI Chat", icon: <MessageSquare className="h-10 w-10 text-[#ADEFD1]" />, link: "/dashboard/ai-chat", description: "Get assistance from our AI (Premium)." },
  ];
  const { user } = useAuth();
  const [quote, setQuote] = useState({ text: "Loading inspirational quote...", author: "" });

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // Using a simple, free quote API. Consider alternatives for production.
        const response = await fetch("https://api.quotable.io/random?maxLength=100&tags=productivity|wisdom|inspiration");
        if (!response.ok) throw new Error("Failed to fetch quote");
        const data = await response.json();
        setQuote({ text: data.content, author: data.author });
      } catch (error) {
        console.error("Quote fetch error:", error);
        setQuote({ text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" });
      }
    };
    fetchQuote();
  }, []);


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-8 dashboard-content-pattern min-h-full"
    >
      <motion.div 
        className="mb-8 p-6 rounded-xl bg-gradient-to-br from-[#ADEFD1]/10 to-transparent border border-[#ADEFD1]/20 shadow-lg"
        initial={{ opacity:0, y: -20 }}
        animate={{ opacity:1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#ADEFD1] mb-2">
          Welcome back, {user?.email?.split('@')[0] || 'User'}!
        </h1>
        <p className="text-lg text-gray-300 italic">"{quote.text}"</p>
        <p className="text-sm text-gray-400 text-right mt-1">- {quote.author || "Unknown"}</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.name}
            custom={index}
            variants={widgetVariants}
            initial="hidden"
            animate="visible"
            className="widget-card p-6 flex flex-col items-center text-center group"
          >
            <Link to={feature.link} className="w-full">
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#ADEFD1]/20 to-[#ADEFD1]/5 inline-block mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">{feature.name}</h2>
              <p className="text-sm text-gray-300">{feature.description}</p>
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


  const SidebarContent = ({ currentPath, setMobileMenuOpenProp }) => (
    <div className="flex flex-col h-full">
      <div className={`p-4 flex items-center border-b border-[#ADEFD1]/20 ${isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center' : 'justify-between'}`}>
        <Link to="/dashboard" onClick={() => setMobileMenuOpenProp && setMobileMenuOpenProp(false)} className="flex items-center gap-2">
            <Sparkles className={`h-7 w-7 text-[#ADEFD1] ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'inline-block' : 'hidden'}`} />
            <motion.span 
                className={`text-2xl font-bold text-[#ADEFD1] ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'hidden' : 'inline-block'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Project Sahur
            </motion.span>
        </Link>
        {!isMobileMenuOpen && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className={`hidden lg:flex text-[#ADEFD1] hover:bg-[#ADEFD1]/10 ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'hidden' : 'inline-flex'}`}>
            <ChevronLeft />
          </Button>
        )}
      </div>
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        <SidebarLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} currentPath={currentPath} isSidebarCollapsed={isSidebarCollapsed} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpenProp}>
          Dashboard
        </SidebarLink>
        <SidebarLink to="/dashboard/tasks" icon={<CheckSquare className="h-5 w-5" />} currentPath={currentPath} isSidebarCollapsed={isSidebarCollapsed} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpenProp}>
          Tasks
        </SidebarLink>
        <SidebarLink to="/dashboard/calendar" icon={<CalendarDays className="h-5 w-5" />} currentPath={currentPath} isSidebarCollapsed={isSidebarCollapsed} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpenProp}>
          Calendar
        </SidebarLink>
        <SidebarLink to="/dashboard/journal" icon={<BookOpenText className="h-5 w-5" />} currentPath={currentPath} isSidebarCollapsed={isSidebarCollapsed} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpenProp}>
          Journal
        </SidebarLink>
        <SidebarLink to="/dashboard/timer" icon={<Timer className="h-5 w-5" />} currentPath={currentPath} isSidebarCollapsed={isSidebarCollapsed} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpenProp}>
          Timer
        </SidebarLink>
        <SidebarLink to="/dashboard/notes" icon={<StickyNote className="h-5 w-5" />} currentPath={currentPath} isSidebarCollapsed={isSidebarCollapsed} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpenProp}>
          Notes
        </SidebarLink>
        <SidebarLink to="/dashboard/ai-chat" icon={<MessageSquare className="h-5 w-5" />} currentPath={currentPath} isSidebarCollapsed={isSidebarCollapsed} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpenProp}>
          AI Chat
        </SidebarLink>
        <SidebarLink to="/subscribe" icon={<Zap className="h-5 w-5" />} currentPath={currentPath} isSidebarCollapsed={isSidebarCollapsed} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpenProp}>
          Subscription
        </SidebarLink>
      </nav>
      <div className="p-4 border-t border-[#ADEFD1]/20">
        <SidebarLink to="/dashboard/settings" icon={<Settings className="h-5 w-5" />} currentPath={currentPath} isSidebarCollapsed={isSidebarCollapsed} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpenProp}>
         Settings
        </SidebarLink>
        <button onClick={handleLogout} className="sidebar-item w-full">
          <LogOut className="h-5 w-5" />
          <span className={`ml-3 ${(isSidebarCollapsed && !isMobileMenuOpen) ? 'lg:hidden' : 'inline-block'}`}>Logout</span>
        </button>
      </div>
    </div>
  );


  return (
    <div className="flex h-screen dashboard-bg hero-pattern">
      <motion.aside 
        className="hidden lg:flex flex-col bg-[#00203F]/90 backdrop-blur-md shadow-lg"
        variants={sidebarVariants}
        initial={false}
        animate={isSidebarCollapsed ? "collapsed" : "expanded"}
      >
        <SidebarContent currentPath={location.pathname} />
      </motion.aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside 
            className="lg:hidden fixed inset-0 z-50 flex flex-col bg-[#00203F]/95 backdrop-blur-md shadow-lg w-64"
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
        <header className="p-4 bg-[#00203F]/80 backdrop-blur-sm flex items-center justify-between shadow-md">
            <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={isMobileMenuOpen ? toggleMobileMenu : (isSidebarCollapsed ? toggleSidebar : toggleMobileMenu)} className="lg:hidden text-[#ADEFD1] hover:bg-[#ADEFD1]/10 mr-2">
                    <Menu />
                </Button>
                 <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden lg:flex text-[#ADEFD1] hover:bg-[#ADEFD1]/10 mr-2">
                    {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </Button>
                <Link to="/dashboard" className="text-xl font-bold text-[#ADEFD1] flex items-center gap-2">
                  <Sparkles className="h-6 w-6 inline-block lg:hidden" />
                  <span className="hidden sm:inline">Project Sahur</span>
                </Link>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0 text-[#ADEFD1] hover:bg-[#ADEFD1]/10">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#00203F] border-[#ADEFD1]/30 text-[#ADEFD1] w-56">
                <DropdownMenuLabel className="text-white px-3 py-2">
                  <p className="font-medium">{user?.email?.split('@')[0] || 'User'}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#ADEFD1]/20" />
                <DropdownMenuItem className="hover:bg-[#ADEFD1]/10 focus:bg-[#ADEFD1]/10 px-3 py-2" onSelect={() => navigate('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#ADEFD1]/10 focus:bg-[#ADEFD1]/10 px-3 py-2" onSelect={() => navigate('/subscribe')}>
                  <Zap className="mr-2 h-4 w-4" />
                  <span>Subscription</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#ADEFD1]/20" />
                <DropdownMenuItem className="hover:bg-[#ADEFD1]/10 focus:bg-[#ADEFD1]/10 text-red-400 focus:text-red-300 px-3 py-2" onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </header>
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {children || <DashboardHomePage key={location.pathname} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;