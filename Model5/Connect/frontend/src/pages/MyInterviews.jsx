import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInterviews } from "@/store/slices/interviewSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import {
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaCheckCircle,
  FaStar,
  FaExternalLinkAlt,
  FaCode,
  FaBrain,
  FaLaptopCode,
  FaServer,
  FaBook,
  FaVideo,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

// ------------------- MAIN COMPONENT -------------------
const MyInterviews = () => {
  const dispatch = useDispatch();
const navigate = useNavigate();

  // Local state management
  const [interviews, setInterviewsState] = useState([]); // All fetched interviews
  const [filter, setFilter] = useState("upcoming"); // Default view: upcoming interviews
  const [sortBy, setSortBy] = useState("date"); // Sort mode: by date
  const [loading, setLoading] = useState(false); // Loading spinner control

  // ------------------- RESOURCE LINKS -------------------
  // Each interview type maps to a list of helpful resources
  const resourceMapping = {
    frontend: [
      { title: "React Official Docs", url: "https://react.dev" },
      { title: "JavaScript.info", url: "https://javascript.info" },
      {
        title: "MDN Web Docs - CSS",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      },
      {
        title: "Frontend Interview Handbook",
        url: "https://www.frontendinterviewhandbook.com",
      },
    ],
    backend: [
      {
        title: "Node.js Best Practices",
        url: "https://github.com/goldbergyoni/nodebestpractices",
      },
      { title: "REST API Tutorial", url: "https://restfulapi.net" },
      {
        title: "Database Design Guide",
        url: "https://www.guru99.com/database-design.html",
      },
      {
        title: "System Design Primer",
        url: "https://github.com/donnemartin/system-design-primer",
      },
    ],
    fullstack: [
      { title: "Full Stack Open", url: "https://fullstackopen.com" },
      { title: "Web Dev Resources", url: "https://web.dev" },
      { title: "Docker Documentation", url: "https://docs.docker.com" },
      {
        title: "System Design Interview",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview",
      },
    ],
    dsa: [
      { title: "LeetCode", url: "https://leetcode.com" },
      { title: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" },
      { title: "BigO Cheat Sheet", url: "https://www.bigocheatsheet.com" },
      {
        title: "Algorithm Visualizer",
        url: "https://algorithm-visualizer.org",
      },
    ],
    system: [
      {
        title: "System Design Primer",
        url: "https://github.com/donnemartin/system-design-primer",
      },
      {
        title: "Designing Data-Intensive Apps",
        url: "https://dataintensive.net",
      },
      {
        title: "System Design Interview Guide",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview",
      },
    ],
    behavioral: [
      {
        title: "STAR Method Guide",
        url: "https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique",
      },
      {
        title: "Behavioral Questions List",
        url: "https://www.themuse.com/advice/30-behavioral-interview-questions-you-should-be-ready-to-answer",
      },
      {
        title: "Interview Preparation Tips",
        url: "https://www.glassdoor.com/blog/common-interview-questions",
      },
    ],
    hr: [
      {
        title: "Common HR Questions",
        url: "https://www.monster.com/career-advice/article/100-potential-interview-questions",
      },
      {
        title: "Salary Negotiation Tips",
        url: "https://www.indeed.com/career-advice/pay-salary/how-to-negotiate-salary",
      },
    ],
    technical: [
      {
        title: "Tech Interview Handbook",
        url: "https://www.techinterviewhandbook.org",
      },
      {
        title: "Coding Interview University",
        url: "https://github.com/jwasham/coding-interview-university",
      },
    ],
  };

  // ------------------- FETCH INTERVIEWS -------------------
  useEffect(() => {
    const fetchInterviews = async () => {
      const token = localStorage.getItem("token"); // Token from localStorage

      console.log("🔍 Fetching interviews...");
      console.log("Filter:", filter);
      console.log("Token exists:", !!token);

      if (!token) {
        console.error("❌ No token found");
        return;
      }

      setLoading(true); // Show loading spinner
      try {
        // Fetch filtered interviews from backend
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/interviews?status=${filter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Interviews fetched:", res.data);
        setInterviewsState(res.data.interviews || []); // Update local state
        dispatch(setInterviews(res.data.interviews || [])); // Update Redux
      } catch (error) {
        console.error(
          "❌ Failed to fetch interviews:",
          error.response?.data || error.message
        );
        setInterviewsState([]); // Clear if fetch fails
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchInterviews();
  }, [filter, dispatch]); // Re-run when filter changes

  // ------------------- FILTER & SORT LOGIC -------------------
  // Filter based on status (upcoming or completed)
  const filteredInterviews = interviews.filter((interview) => {
    if (filter === "upcoming")
      return (
        interview.status === "scheduled" || interview.status === "upcoming"
      );
    if (filter === "completed") return interview.status === "completed";
    return true;
  });

const handleStartInterview = (interviewId) => {
  // Navigate client-side, avoids full page reload and 404
  navigate(`/interview-room/${interviewId}`);
};

  // Sort by date or type
  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    if (sortBy === "date")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "type") return a.type.localeCompare(b.type);
    return 0;
  });

  // ------------------- HELPER FUNCTIONS -------------------
  // Color by interview type
  const getTypeColor = (type) => {
    const colors = {
      behavioral: "bg-purple-500",
      fullstack: "bg-blue-500",
      frontend: "bg-green-500",
      backend: "bg-orange-500",
      dsa: "bg-red-500",
      system: "bg-cyan-500",
      hr: "bg-pink-500",
      technical: "bg-indigo-500",
    };
    return colors[type] || "bg-gray-500";
  };

  // Icon by interview type
  const getTypeIcon = (type) => {
    const icons = {
      frontend: FaCode,
      backend: FaServer,
      fullstack: FaLaptopCode,
      behavioral: FaBrain,
      dsa: FaCode,
      system: FaServer,
      hr: FaUserTie,
      technical: FaBook,
    };
    const Icon = icons[type] || FaBook;
    return <Icon />;
  };

  // Badge color and label for result status
  const getResultBadge = (result) => {
    if (!result) return null;
    const variants = {
      passed: { className: "bg-green-500 text-white", label: "Passed" },
      failed: { className: "bg-red-500 text-white", label: "Failed" },
      pending: { className: "bg-yellow-500 text-black", label: "Pending" },
    };
    const variant = variants[result] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  // ------------------- RENDER UI -------------------
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
        {/* ------------- HEADER SECTION ------------- */}
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-2">My Interviews</h1>
              <p className="text-lg opacity-90">
                Track your interview progress and feedback
              </p>
            </motion.div>
          </div>
        </div>

        {/* ------------- FILTERS SECTION ------------- */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Filter by status (Upcoming / Completed) */}
            <Select value={filter} onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter interviews" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort interviews by date or type */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="type">Interview Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ------------- MAIN CONTENT ------------- */}
          {loading ? (
            // Loader while fetching interviews
            <div className="text-center py-12">
              <p className="text-lg">Loading interviews...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* No interviews found */}
              {sortedInterviews.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground text-lg">
                      No {filter} interviews found
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {filter === "upcoming"
                        ? "Schedule your next interview from the dashboard"
                        : "Complete some interviews to see them here"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                // List all interviews dynamically
                sortedInterviews.map((interview, index) => (
                  <motion.div
                    key={interview._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Individual Interview Card */}
                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Left Section: Info */}
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-12 rounded-full ${getTypeColor(
                                interview.type
                              )}`}
                            />
                            <div>
                              <CardTitle className="text-xl capitalize flex items-center gap-2">
                                {getTypeIcon(interview.type)}
                                {interview.type.replace("_", " ")} Interview
                              </CardTitle>
                              {/* Date, Time, Interviewer */}
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <FaCalendarAlt className="h-3 w-3" />
                                  {new Date(
                                    interview.date
                                  ).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaClock className="h-3 w-3" />
                                  {interview.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaUserTie className="h-3 w-3" />
                                  {interview.interviewer}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Section: Status Badge */}
                          <div className="flex items-center gap-2">
                            {filter === "upcoming" ? (
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                <FaClock className="h-3 w-3" /> Scheduled
                              </Badge>
                            ) : (
                              <>
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  <FaCheckCircle className="h-3 w-3" />{" "}
                                  Completed
                                </Badge>
                                {getResultBadge(interview.result)}
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {/* --- UPCOMING INTERVIEWS --- */}
                        {filter === "upcoming" && (
                          <div className="space-y-4">
                            {/* Optional Notes */}
                            {interview.notes && (
                              <div className="bg-secondary/50 rounded-lg p-4">
                                <p className="text-sm font-medium mb-2">
                                  Notes:
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {interview.notes}
                                </p>
                              </div>
                            )}
                            {/* Preparation Resources */}
                            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                <FaBook className="text-blue-500" />
                                Preparation Resources:
                              </p>
                              <div className="space-y-2">
                                {(resourceMapping[interview.type] || []).map(
                                  (resource, idx) => (
                                    <a
                                      key={idx}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline"
                                    >
                                      <FaExternalLinkAlt className="h-3 w-3" />
                                      {resource.title}
                                    </a>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* This is the upcoming interview section*/}
                        {filter === "upcoming" && (
                          <div className="mt-4 pt-4 border-t">
                            <button
                              onClick={() =>
                                handleStartInterview(interview._id)
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                              <FaVideo className="h-4 w-4" />
                              Start Interview
                            </button>
                          </div>
                        )}

                        {/* --- COMPLETED INTERVIEWS --- */}
                        {filter === "completed" && (
                          <div className="space-y-4">
                            {/* Score */}
                            {interview.score !== undefined &&
                              interview.score !== null && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    Score:
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <FaStar className="h-4 w-4 text-yellow-500" />
                                    <span className="font-bold text-lg">
                                      {interview.score}/100
                                    </span>
                                  </div>
                                </div>
                              )}

                            {/* Feedback */}
                            {interview.feedback && (
                              <div className="bg-secondary/50 rounded-lg p-4">
                                <p className="text-sm font-medium mb-2">
                                  Feedback:
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {interview.feedback}
                                </p>
                              </div>
                            )}

                            {/* Notes */}
                            {interview.notes && (
                              <div className="bg-secondary/50 rounded-lg p-4">
                                <p className="text-sm font-medium mb-2">
                                  Notes:
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {interview.notes}
                                </p>
                              </div>
                            )}

                            {/* Pending Feedback */}
                            {!interview.feedback && !interview.score && (
                              <p className="text-sm text-muted-foreground italic">
                                Feedback pending from interviewer
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyInterviews;
