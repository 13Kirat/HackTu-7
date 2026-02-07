import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Loader2, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setLoginError(result.error || "Login failed");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    const result = await signup(signupName, signupEmail, signupPassword);
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setSignupError(result.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">SupplyChain</h1>
          <p className="text-sm text-muted-foreground">Supply Chain Optimization Platform</p>
        </div>

        <Card>
          <Tabs defaultValue="login">
            <CardHeader className="pb-3">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <CardDescription>Sign in to your account to continue.</CardDescription>
                  {loginError && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {loginError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="arjun@supplyco.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign In
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Demo: use any email from the Users page (e.g. arjun@supplyco.com) with any 6+ char password.
                  </p>
                </CardContent>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <CardDescription>Create a new account to get started.</CardDescription>
                  {signupError && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {signupError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" placeholder="John Doe" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="john@company.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" placeholder="Min 6 characters" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Create Account
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
