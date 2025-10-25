/**
 * Profile Component
 * 
 * User profile management page with view/edit functionality.
 * Allows authenticated users to view and update their personal information.
 * 
 * Features:
 * - View user profile information (name, email, contact, date of birth)
 * - Edit mode toggle for updating profile details
 * - Email field is non-editable for security reasons
 * @component
 * @returns {JSX.Element} Profile page with editable form and account info
 */

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaSave, FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";

const Profile = () => {
  /**
   * Redux and Hook Initialization
   */
  
  // Redux dispatch for updating global auth state
  const dispatch = useDispatch();
  
  // Toast hook for displaying notifications
  const { toast } = useToast();
  
  // Redux user state (may not be available initially)
  const reduxUser = useSelector((state) => state.auth?.user);
  
  /**
   * Component State Management
   */
  
  // Local user state with full profile data
  const [user, setUser] = useState(null);
  
  // Toggle between view mode and edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);
  
  /**
   * Form data state containing editable user fields
   * @property {string} name - User's full name (editable)
   * @property {string} email - User's email address (non-editable)
   * @property {string} contact - User's contact number (editable)
   * @property {string} dob - User's date of birth (editable)
   */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    dob: "",
  });

  /**
   * Effect Hook: Fetch user data on component mount
   * 
   * Data Fetching Strategy (Dual Source):
   * 1. First checks localStorage for cached user data (fast, offline-capable)
   * 2. Then fetches from backend API for fresh data (authoritative source)
   * 3. Updates both local state and localStorage cache
   * 
   * This approach provides:
   * - Fast initial render with cached data
   * - Up-to-date information from server
   * - Offline capability with stale data
   */
  useEffect(() => {
    const fetchUserData = async () => {
      // Retrieve cached user data from localStorage
      const storedUser = localStorage.getItem("user");
      
      // Retrieve authentication token
      const token = localStorage.getItem("token");
      
      // Debug logging for development
      console.log("🔍 Checking user data...");
      console.log("Stored user:", storedUser);
      console.log("Token exists:", !!token);

      // Strategy 1: Load from localStorage first (immediate display)
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ User from localStorage:", parsedUser);
          
          // Update component state with cached data
          setUser(parsedUser);
          setFormData({
            name: parsedUser.name || "",
            email: parsedUser.email || "",
            contact: parsedUser.contact || "",
            dob: parsedUser.dob || "",
          });
        } catch (error) {
          console.error("Error parsing user:", error);
        }
      }

      // Strategy 2: Fetch fresh data from backend API
      if (token) {
        try {
          // Call backend API to get current user data
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include JWT token
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("✅ User from API:", data.user);
            
            // Update state with fresh API data
            setUser(data.user);
            setFormData({
              name: data.user.name || "",
              email: data.user.email || "",
              contact: data.user.contact || "",
              dob: data.user.dob ? data.user.dob.split("T")[0] : "",
            });
            
            // Update localStorage cache for next visit
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }

      // Mark loading as complete
      setLoading(false);
    };

    fetchUserData();
  }, []); // Empty dependency array - run once on mount

  /**
   * Handles profile update form submission
   * 
   * Process Flow:
   * 1. Prevents default form submission
   * 2. Validates authentication token
   * 3. Sends PUT request to update endpoint
   * 4. Updates local state and localStorage on success
   * 5. Dispatches Redux action to sync global state
   * 6. Shows success/error toast notification
   * 7. Exits edit mode on success
   * 
   * Note: Email is NOT included in update request (non-editable field)
   * 
   * @param {Event} e - Form submit event
   * @async
  */

const formatDateForBackend = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Ensure valid date
  if (isNaN(date)) return "";
  // Format to YYYY-MM-DD
  return date.toISOString().split("T")[0];
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    toast({
      title: "Error",
      description: "Please login again",
      variant: "destructive",
    });
    return;
  }

  try {
    // Convert DOB before sending
    const formattedDob = formatDateForBackend(formData.dob);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name,
        contact: formData.contact,
        dob: formattedDob, // ensure consistent backend format
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(updateProfile(data.user));

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Update Failed",
        description: data.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Update error:", error);
    toast({
      title: "Error",
      description: "Failed to update profile",
      variant: "destructive",
    });
  }
};







  /**
   * Handles cancel button click in edit mode
   * Resets form data to original user values and exits edit mode
   * Discards any unsaved changes
   */
  const handleCancel = () => {
    // Reset form to original user data
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      contact: user?.contact || "",
      dob: user?.dob || "",
    });
    
    // Exit edit mode without saving
    setIsEditing(false);
  };

  /**
   * Loading State Render
   * Shows centered loading message while fetching user data
   */
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  /**
   * Main Component Render - Profile Page
   */
  return (
    <Layout>
      {/* Main container with padding and max width */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Page Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information
          </p>
        </motion.div>

        {/* Main Content Grid - Form on left, Stats on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Form (2/3 width on desktop) */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </div>
                  
                  {/* Edit Button - Only visible in view mode */}
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FaEdit />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Full Name Input (Editable) */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <FaUser className="text-muted-foreground" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing} // Only editable in edit mode
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Address Input (Non-Editable) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <FaEnvelope className="text-muted-foreground" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled // Email is always disabled (non-editable)
                      className="bg-muted" // Visual indicator of disabled state
                    />
                    <p className="text-xs text-muted-foreground">
                      Email address cannot be changed
                    </p>
                  </div>

                  {/* Contact Number Input (Editable) */}
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="flex items-center gap-2">
                      <FaPhone className="text-muted-foreground" />
                      Contact Number
                    </Label>
                    <Input
                      id="contact"
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter your contact number"
                    />
                  </div>

                  {/* Date of Birth Input (Editable) */}
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="flex items-center gap-2">
                      <FaCalendar className="text-muted-foreground" />
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Action Buttons - Only visible in edit mode */}
                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      {/* Save Button */}
                      <Button
                        type="submit"
                        className="flex-1 flex items-center gap-2"
                      >
                        <FaSave />
                        Save Changes
                      </Button>
                      
                      {/* Cancel Button */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Account Statistics (1/3 width on desktop) */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Member Since Display */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-semibold">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Account Status Display */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <p className="font-semibold text-green-600">Active</p>
                </div>

                {/* User ID Display */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm">{user?.id || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
