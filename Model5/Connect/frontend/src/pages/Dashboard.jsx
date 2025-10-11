import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInterviews } from "@/store/slices/interviewSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserTie, 
  FaCode, 
  FaBrain, 
  FaLaptopCode, 
  FaRocket,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaUsers,
  FaBuilding,
  FaCheckCircle,
  FaChartLine
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

// Main Dashboard Component
const Dashboard = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const interviews = useSelector((state) => state.interviews.interviews || []); // Accessing Redux state
  const [loading, setLoading] = useState(false); // Button loading state
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    time: "",
    interviewer: "",
    duration: 60,
    notes: ""
  });

  // Predefined interview types with icons and colors
  const interviewTypes = [
    { value: "behavioral", label: "Behavioral Interview", icon: FaBrain, color: "text-purple-500" },
    { value: "frontend", label: "Frontend Interview", icon: FaReact, color: "text-blue-500" },
    { value: "backend", label: "Backend Interview", icon: FaNodeJs, color: "text-green-500" },
    { value: "fullstack", label: "Full-Stack Interview", icon: FaLaptopCode, color: "text-indigo-500" },
    { value: "dsa", label: "DSA Interview", icon: FaCode, color: "text-red-500" },
    { value: "system", label: "System Design", icon: FaDatabase, color: "text-orange-500" },
    { value: "hr", label: "HR Interview", icon: FaUsers, color: "text-pink-500" },
    { value: "technical", label: "Technical Round", icon: FaRocket, color: "text-cyan-500" },
  ];

  // List of interviewers with specialties
  const interviewers = [
    { name: "Sarah Johnson", icon: FaUserTie, specialty: "Frontend Expert", color: "text-blue-600" },
    { name: "Mike Chen", icon: FaUserTie, specialty: "Backend Specialist", color: "text-green-600" },
    { name: "Emily Rodriguez", icon: FaUserTie, specialty: "Full-Stack Lead", color: "text-purple-600" },
    { name: "David Park", icon: FaUserTie, specialty: "System Design", color: "text-orange-600" },
    { name: "Jessica Williams", icon: FaUserTie, specialty: "DSA Expert", color: "text-red-600" },
    { name: "Alex Kumar", icon: FaUserTie, specialty: "Behavioral Coach", color: "text-pink-600" },
    { name: "Rachel Adams", icon: FaUserTie, specialty: "Technical Lead", color: "text-cyan-600" },
  ];

  // Fetch interviews when dashboard loads
  useEffect(() => {
    const fetchInterviews = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Fetching interview data from backend
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/interviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setInterviews(res.data.interviews)); // Updating Redux store
      } catch (error) {
        console.error("Failed to fetch interviews:", error);
      }
    };

    fetchInterviews();
  }, [dispatch]);

  // Form submission logic for scheduling interview
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔴🔴🔴 DASHBOARD SCHEDULE SUBMIT");
    console.log("Form data:", formData);

    // Validation check
    if (!formData.type || !formData.date || !formData.time || !formData.interviewer) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true); // Show loading spinner during API call

    try {
      console.log("📡 Sending to backend...");
      
      // Sending POST request to backend to create new interview
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("📦 Response:", data);

      if (response.ok) {
        console.log("✅ Interview created successfully!");
        toast({
          title: "Interview Scheduled!",
          description: `Your ${formData.type} interview has been scheduled for ${formData.date} at ${formData.time}`,
        });

        // Refreshing interview list after successful creation
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/interviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setInterviews(res.data.interviews));

        // Reset form fields
        setFormData({ type: "", date: "", time: "", interviewer: "", duration: 60, notes: "" });
      } else {
        // Error toast from backend
        toast({
          title: "Error",
          description: data.message || "Failed to schedule interview",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Catch network or server errors
      console.error("💥 Error:", error);
      toast({
        title: "Error",
        description: "Failed to schedule interview",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to get icon for selected interview type
  const getSelectedTypeIcon = () => {
    const type = interviewTypes.find(t => t.value === formData.type);
    if (!type) return null;
    const Icon = type.icon;
    return <Icon className={`${type.color} mr-2`} />;
  };

  // Helper to get icon for selected interviewer
  const getSelectedInterviewerIcon = () => {
    const interviewer = interviewers.find(i => i.name === formData.interviewer);
    if (!interviewer) return null;
    const Icon = interviewer.icon;
    return <Icon className={`${interviewer.color} mr-2`} />;
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
        {/* ---------------------- HERO SECTION ---------------------- */}
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-16 text-start">
            {/* Motion animation on page load */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to connect</h1>
              <p className="text-lg md:text-xl opacity-90">Schedule your mock interviews and prepare for success</p>
            </motion.div>
          </div>
        </div>

        {/* ---------------------- MAIN CONTENT ---------------------- */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ---------------------- SCHEDULE FORM ---------------------- */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" />
                    Schedule Interview
                  </CardTitle>
                  <CardDescription>
                    Book a mock interview session with our expert interviewers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Interview Type Selector */}
                    {/* Uses icons for each interview type */}
                    <div className="space-y-2">
                      <Label htmlFor="type">Interview Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select interview type">
                            {formData.type && (
                              <div className="flex items-center">
                                {getSelectedTypeIcon()}
                                <span>{interviewTypes.find(t => t.value === formData.type)?.label}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {interviewTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className={type.color} />
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-2">
                      <Label htmlFor="date" className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        Date *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        className="cursor-pointer"
                      />
                    </div>

                    {/* Time Picker */}
                    <div className="space-y-2">
                      <Label htmlFor="time" className="flex items-center gap-2">
                        <FaClock className="text-green-500" />
                        Time *
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="cursor-pointer"
                      />
                    </div>

                    {/* Interviewer Selector */}
                    <div className="space-y-2">
                      <Label htmlFor="interviewer" className="flex items-center gap-2">
                        <FaUserTie className="text-purple-500" />
                        Choose Interviewer *
                      </Label>
                      <Select
                        value={formData.interviewer}
                        onValueChange={(value) => setFormData({ ...formData, interviewer: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an interviewer">
                            {formData.interviewer && (
                              <div className="flex items-center">
                                {getSelectedInterviewerIcon()}
                                <span>{formData.interviewer}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {interviewers.map((interviewer) => {
                            const Icon = interviewer.icon;
                            return (
                              <SelectItem key={interviewer.name} value={interviewer.name}>
                                <div className="flex items-center gap-2">
                                  <Icon className={interviewer.color} />
                                  <div>
                                    <div className="font-medium">{interviewer.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {interviewer.specialty}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Duration Field */}
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        min="15"
                        max="240"
                      />
                    </div>

                    {/* Notes Field */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Input
                        id="notes"
                        placeholder="Any specific topics you want to focus on..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <FaClock className="animate-spin" />
                          Scheduling...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <FaRocket />
                          Schedule Interview
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* ---------------------- RIGHT SIDEBAR ---------------------- */}
            <div className="space-y-6">
              
              {/* --- Progress Stats Card --- */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaChartLine className="text-blue-500" />
                      Your Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Total Interviews */}
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <span className="text-sm font-medium">Total Interviews</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{interviews.length}</span>
                    </div>
                    
                    {/* Completed Interviews */}
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        {interviews.filter((i) => i.status === "completed").length}
                      </span>
                    </div>
                    
                    {/* Upcoming Interviews */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-orange-500" />
                        <span className="text-sm font-medium">Upcoming</span>
                      </div>
                      <span className="text-2xl font-bold text-orange-600">
                        {interviews.filter((i) => i.status === "scheduled" || i.status === "upcoming").length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* --- Quick Tips Section --- */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <Card class="rounded-lg text-black">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaRocket className="text-purple-500" />
                      Quick Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Practice behavioral questions daily</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Review your past interview feedback</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Prepare your tech stack thoroughly</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Join our practice resources section</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
