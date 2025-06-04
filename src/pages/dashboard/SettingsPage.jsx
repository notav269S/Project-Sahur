import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bell, Palette, ShieldCheck, UserCircle2, LogOut, Trash2, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileName, setProfileName] = useState(user?.email?.split('@')[0] || "User");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Load user subscription plan from localStorage (placeholder)
  const [subscriptionPlan, setSubscriptionPlan] = useState("Free"); 
  useEffect(() => {
    const plan = localStorage.getItem('userSubscriptionPlan') || 'Free';
    setSubscriptionPlan(plan.charAt(0).toUpperCase() + plan.slice(1));
  }, []);


  const handleLogout = () => {
    logout();
    toast({ title: "Logged Out", description: "You have been successfully logged out."});
    navigate("/");
  };
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "New password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    // Placeholder for actual password change logic
    console.log("Attempting to change password for", user.email, "from", currentPassword, "to", newPassword);
    toast({ title: "Password Updated", description: "Your password has been changed (simulated)." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const settingsSections = [
    {
      title: "Profile Information",
      icon: <UserCircle2 className="h-6 w-6 text-[#ADEFD1]" />,
      content: (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <Input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Your Name" className="bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <Input type="email" value={user?.email || ""} placeholder="your@email.com" disabled className="bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400 opacity-70 cursor-not-allowed" />
          </div>
        </>
      ),
      actionText: "Update Profile",
      action: () => toast({ title: "Profile Updated!", description: `Name changed to ${profileName}.`})
    },
    {
      title: "Subscription",
      icon: <CreditCard className="h-6 w-6 text-[#ADEFD1]" />,
      content: (
        <div className="text-center">
          <p className="text-lg text-white">Your current plan: <span className="font-bold text-[#ADEFD1]">{subscriptionPlan}</span></p>
          <p className="text-sm text-gray-400 mt-1">Manage your subscription details and explore upgrade options.</p>
        </div>
      ),
      actionText: "Manage Subscription",
      action: () => navigate("/subscribe")
    },
    {
      title: "Security",
      icon: <ShieldCheck className="h-6 w-6 text-[#ADEFD1]" />,
      content: (
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current Password" required className="bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400" />
          <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" required className="bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400" />
          <Input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} placeholder="Confirm New Password" required className="bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400" />
          <Button type="submit" className="w-full bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90">Change Password</Button>
        </form>
      ),
      actionText: null, // Action is within the form
    },
    {
      title: "Account Actions",
      icon: <LogOut className="h-6 w-6 text-[#ADEFD1]" />,
      content: (
        <div className="space-y-3">
            <p className="text-sm text-gray-400">Logout from your current session or delete your account permanently.</p>
        </div>
      ),
      actionText: "Logout",
      action: handleLogout,
      secondaryActionText: "Delete Account",
      secondaryAction: () => toast({ title: "Delete Account Clicked", description: "This is a placeholder. Account deletion needs backend.", variant: "destructive"}),
      secondaryActionVariant: "destructive"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 text-[#ADEFD1]"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {settingsSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="widget-card">
              <CardHeader className="flex flex-row items-center gap-3 p-4 border-b border-[#ADEFD1]/20">
                {section.icon}
                <CardTitle className="text-xl text-white">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {section.content}
              </CardContent>
              {(section.actionText || section.secondaryActionText) && (
                <CardFooter className={`p-4 border-t border-[#ADEFD1]/20 ${section.secondaryActionText ? 'flex justify-between items-center' : ''}`}>
                  {section.actionText && (
                    <Button onClick={section.action} className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90">
                      {section.actionText}
                    </Button>
                  )}
                  {section.secondaryActionText && (
                    <Button onClick={section.secondaryAction} variant={section.secondaryActionVariant || "outline"} className={section.secondaryActionVariant === "destructive" ? "text-red-400 border-red-400 hover:bg-red-400/10 hover:text-red-300" : "border-[#ADEFD1] text-[#ADEFD1] hover:bg-[#ADEFD1]/10"}>
                      {section.secondaryActionVariant === "destructive" && <Trash2 className="mr-2 h-4 w-4" />}
                      {section.secondaryActionText}
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SettingsPage;