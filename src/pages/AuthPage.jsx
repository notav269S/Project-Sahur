import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Mail, Lock, UserPlus, LogIn, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        await login(email, password);
        toast({ title: "Login Successful!", description: "Welcome back to Project Sahur.", variant: "default" });
        navigate("/dashboard");
      } catch (error) {
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      }
    } else {
      if (password !== confirmPassword) {
        toast({ title: "Signup Failed", description: "Passwords do not match.", variant: "destructive" });
        return;
      }
      try {
        await signup(email, password);
        toast({ title: "Signup Successful!", description: "Welcome to Project Sahur! Please login.", variant: "default" });
        setIsLogin(true); // Switch to login form after successful signup
        setPassword(""); // Clear password fields
        setConfirmPassword("");
      } catch (error) {
        toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
      }
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen flex items-center justify-center hero-pattern p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md bg-[#00203F]/90 border-[#ADEFD1]/20 shadow-2xl backdrop-blur-lg">
          <CardHeader className="text-center">
            <Link to="/">
              <CardTitle className="text-4xl font-bold text-[#ADEFD1] mb-2">Project Sahur</CardTitle>
            </Link>
            <CardDescription className="text-gray-300 text-lg">
              {isLogin ? "Welcome back! Please login." : "Create your account to get started."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400 focus:border-[#ADEFD1]"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400 focus:border-[#ADEFD1]"
                />
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#ADEFD1]">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400 focus:border-[#ADEFD1]"
                  />
                  <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#ADEFD1]">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              )}
              <Button type="submit" className="w-full bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90 text-lg py-6">
                {isLogin ? <LogIn className="mr-2 h-5 w-5" /> : <UserPlus className="mr-2 h-5 w-5" />}
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-[#ADEFD1] hover:text-white">
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Button>
            {isLogin && (
              <Button variant="link" className="text-gray-400 hover:text-[#ADEFD1] text-sm mt-2">
                Forgot Password?
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;