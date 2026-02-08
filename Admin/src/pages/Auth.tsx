import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Package, Loader2, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">FlowChain Admin</h1>
          <p className="text-sm text-muted-foreground">Where every product finds its perfect path.</p>
        </div>

        <Card>
          <CardHeader className="pb-3 text-center">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Sign in with your Admin account to continue.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input 
                  id="login-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
              </Button>
            </form>
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50 text-[11px] space-y-2">
                <p className="font-bold uppercase tracking-widest text-muted-foreground mb-1">Demo Access (Admin)</p>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Admin:</span>
                    <code className="bg-background px-1.5 py-0.5 rounded border">admin@example.com / password123</code>
                </div>
                {/* <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Manager:</span>
                    <code className="bg-background px-1.5 py-0.5 rounded border">factory@example.com / password123</code>
                </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
