import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import Logo from "@/components/ui/Logo.jsx";
import GoogleSignIn from "@/components/auth/GoogleSignIn";

// ---------------------- MAIN LOGIN COMPONENT ----------------------
const Login = () => {
  const navigate = useNavigate(); // Used for page redirection after login
  const dispatch = useDispatch(); // For updating global auth state (Redux)
  const { toast } = useToast(); // Toast notifications

  // Loading and input state management
  const [loading, setLoading] = useState(false);

  // User input values (controlled form)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Validation error messages
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // ---------------------- FORM VALIDATION ----------------------
  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    
    // Email field validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Password field validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password; // Return true if valid
  };

  // ---------------------- LOGIN FORM SUBMISSION ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Prevent submission if invalid input

    setLoading(true); // Show loading state
    
    try {
      console.log("🔐 Attempting login with:", formData.email);
      
      // API request to backend for login
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("📡 Login response:", data);

      // ✅ If login is successful
      if (response.ok) {
        console.log("✅ Login successful!");
        console.log("💾 Saving token to localStorage...");

        // Save authentication data locally
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("✅ Token saved:", data.token.substring(0, 20) + "...");

        // Update global Redux auth state
        dispatch(loginSuccess({
          user: data.user,
          token: data.token,
        }));

        // Success message
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${data.user.name}!`,
        });

        // Redirect to dashboard after login
        navigate("/dashboard");
      } 
      // ❌ If login fails (wrong credentials)
      else {
        console.error("❌ Login failed:", data.message);
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } 
    // 🚨 Catch network or unexpected errors
    catch (error) {
      console.error("💥 Login error:", error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } 
    // Always stop loading state
    finally {
      setLoading(false);
    }
  };

  // ---------------------- GOOGLE LOGIN HANDLER (Placeholder) ----------------------
  const handleGoogleLogin = () => {
    toast({
      title: "Google Login",
      description: "Google authentication will be implemented soon",
    });
  };

  // ---------------------- RENDER UI ----------------------
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
      {/* Centered Login Card */}
      <div className="w-full max-w-md animate-fade-up">
        
        {/* App Logo and Welcome Text */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold bg-primary bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Login to access your interviews
          </p>
        </div>

        {/* ---------------------- LOGIN CARD ---------------------- */}
        <Card className="shadow-xl bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ---------------------- LOGIN FORM ---------------------- */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL INPUT FIELD */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                {/* Display email error */}
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD INPUT FIELD */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                {/* Display password error */}
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* LOGIN BUTTON */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* ---------------------- DIVIDER ---------------------- */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* ---------------------- GOOGLE SIGN-IN ---------------------- */}
            <GoogleSignIn />

            {/* ---------------------- LINKS ---------------------- */}
            <div className="flex flex-col gap-2 mt-6">
              {/* Forgot Password Link */}
              <p className="text-center text-sm text-muted-foreground">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline font-medium"
                >
                  Forgot your password?
                </Link>
              </p>

              {/* Sign-up Link */}
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Export the component
export default Login;
