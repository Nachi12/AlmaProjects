/**
 * Signup Component
 * 
 * User registration page with form validation and Google OAuth integration.
 * Handles new user account creation with email/password and Google authentication.
 * Validates all input fields and provides real-time error feedback.
 * 
 * Features:
 * - Email/password registration with validation
 * - Google OAuth signup integration
 * - Real-time form validation with error messages
 * - Password strength requirements (minimum 6 characters)
 * - Contact number validation (10 digits)
 * - Duplicate password confirmation
 * 
 * @component
 * @returns {JSX.Element} Signup form with validation and Google OAuth option
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import Logo from "@/components/ui/Logo.jsx";
import GoogleSignIn from "@/components/auth/GoogleSignIn";

const Signup = () => {
  // Hook for programmatic navigation after successful registration
  const navigate = useNavigate();
  
  // Redux dispatch hook for updating global auth state
  const dispatch = useDispatch();
  
  // Hook for displaying toast notifications
  const { toast } = useToast();
  
  // Loading state to disable form during submission
  const [loading, setLoading] = useState(false);
  
  /**
   * Form data state object containing all user registration fields
   * @property {string} name - User's full name
   * @property {string} email - User's email address
   * @property {string} contact - User's contact number (10 digits)
   * @property {string} password - User's password (minimum 6 characters)
   * @property {string} confirmPassword - Password confirmation for validation
   */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  /**
   * Error state object for storing validation error messages
   * Each field has a corresponding error message string
   * Empty string means no error for that field
   */
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  /**
   * Validates all form fields according to specified rules
   * 
   * Validation Rules:
   * - Name: Required, cannot be empty
   * - Email: Required, must be valid email format (regex: \S+@\S+\.\S+)
   * - Contact: Required, must be exactly 10 digits
   * - Password: Required, minimum 6 characters length
   * - Confirm Password: Must match the password field
   * 
   * @returns {boolean} true if all validations pass, false otherwise
   */
  const validateForm = () => {
    // Initialize error object with empty strings
    const newErrors = { 
      name: "", 
      email: "", 
      contact: "", 
      password: "", 
      confirmPassword: "" 
    };

    // Validate name field - required
    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    // Validate email field - required and format check
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      // Regex pattern checks for valid email format
      newErrors.email = "Email is invalid";
    }

    // Validate contact number - required and 10 digits
    if (!formData.contact) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, ""))) {
      // Remove non-digits and check if exactly 10 digits remain
      newErrors.contact = "Contact number must be 10 digits";
    }

    // Validate password - required and minimum length
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Validate password confirmation - must match password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Update error state with validation results
    setErrors(newErrors);
    
    // Return true only if all errors are empty strings
    return Object.values(newErrors).every(error => !error);
  };

  /**
   * Handles form submission for user registration
   * 
   * Process Flow:
   * 1. Prevents default form submission
   * 2. Validates all form fields
   * 3. Sets loading state and disables form
   * 4. Sends registration data to backend API (simulated with setTimeout)
   * 5. Dispatches loginSuccess action to Redux store
   * 6. Shows success toast notification
   * 7. Redirects user to dashboard
   * 
   * @param {Event} e - Form submit event
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Stop submission if validation fails
    if (!validateForm()) return;
    
    // Show loading spinner and disable form
    setLoading(true);

    // Simulate API call with timeout (replace with actual API call)
    // TODO: Replace with actual backend API endpoint
    setTimeout(() => {
      // Dispatch user data to Redux store for global state management
      dispatch(loginSuccess({
        id: "1", // TODO: Replace with actual user ID from API response
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
      }));

      // Show success notification to user
      toast({
        title: "Registration Successful!",
        description: "Welcome to connect",
      });

      // Redirect to dashboard after successful registration
      navigate("/dashboard");
      
      // Reset loading state
      setLoading(false);
    }, 1000);
  };

  /**
   * Handles Google OAuth signup button click
   * 
   * Currently shows a placeholder toast notification.
   * TODO: Implement actual Google OAuth authentication flow
   * 
   * @function
   */
  const handleGoogleSignup = () => {
    toast({
      title: "Google Sign Up",
      description: "Google authentication will be implemented soon",
    });
  };

  return (
    /* Main container with gradient background and full viewport height */
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Registration card container with max width */}
      <Card className="w-full max-w-md shadow-2xl border-0">
        {/* Card header with logo and description */}
        <CardHeader className="space-y-3">
          {/* Centered logo */}
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          
          {/* Main heading */}
          <CardTitle className="text-2xl font-bold text-center">
            Join connect to ace your interviews
          </CardTitle>
          
          {/* Login link for existing users */}
          <CardDescription className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Login
            </Link>
          </CardDescription>
        </CardHeader>

        {/* Card content with registration form */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input Field with Icon and Error Display */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                {/* User icon positioned absolutely inside input */}
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10" // Left padding for icon
                  required
                />
              </div>
              {/* Show error message if validation fails */}
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Input Field with Icon and Error Display */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                {/* Email icon */}
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              {/* Email validation error message */}
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Contact Number Input Field with Icon and Error Display */}
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number *</Label>
              <div className="relative">
                {/* Phone icon */}
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="contact"
                  type="tel"
                  placeholder="1234567890"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="pl-10"
                  maxLength="10" // Limit input to 10 digits
                  required
                />
              </div>
              {/* Contact validation error message */}
              {errors.contact && (
                <p className="text-sm text-red-500">{errors.contact}</p>
              )}
            </div>

            {/* Password Input Field with Icon and Error Display */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                {/* Lock icon */}
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              {/* Password validation error message */}
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input Field with Icon and Error Display */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                {/* Lock icon for password confirmation */}
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              {/* Password match validation error message */}
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button with Loading State */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading} // Disable button during form submission
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Divider with "OR" text */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Component */}
            <GoogleSignIn />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
