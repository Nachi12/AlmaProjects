import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setQuestions, setBlogs, setCategory, setPage } from "@/store/slices/resourceSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Layout from "@/components/layout/Layout";
import { 
  FaCode, 
  FaBrain, 
  FaLaptopCode, 
  FaBookOpen, 
  FaExternalLinkAlt,
  FaReact,
  FaNodeJs,
  FaServer,
  FaUsers,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { motion } from "framer-motion";

const Resources = () => {
  const dispatch = useDispatch();
  const { questions, blogs, selectedCategory, currentPage } = useSelector(
    (state) => state.resources || { questions: [], blogs: [], selectedCategory: "frontend", currentPage: 1 }
  );
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const questionsPerPage = 10;

  // Category configuration with icons
  const categories = [
    { value: "frontend", label: "Frontend Development", icon: FaReact, color: "text-blue-500" },
    { value: "backend", label: "Backend Development", icon: FaNodeJs, color: "text-green-500" },
    { value: "fullstack", label: "Full Stack Development", icon: FaLaptopCode, color: "text-purple-500" },
    { value: "behavioral", label: "Behavioral", icon: FaBrain, color: "text-pink-500" },
  ];

  // Fetch questions from API based on category
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions?category=${selectedCategory}`);
        
        if (response.ok) {
          const data = await response.json();
          dispatch(setQuestions(data.questions || []));
        } else {
          // Fallback to mock data if API fails
          const mockQuestions = getMockQuestions(selectedCategory);
          dispatch(setQuestions(mockQuestions));
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        // Use mock data as fallback
        const mockQuestions = getMockQuestions(selectedCategory);
        dispatch(setQuestions(mockQuestions));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
    dispatch(setPage(1)); // Reset to page 1 when category changes
  }, [selectedCategory, dispatch]);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setBlogsLoading(true);
      try {
        // Using Dev.to API for real blog posts
        const response = await fetch('https://dev.to/api/articles?tag=interview&per_page=6');
        
        if (response.ok) {
          const data = await response.json();
          const formattedBlogs = data.map((article) => ({
            id: article.id,
            title: article.title,
            excerpt: article.description || article.title,
            url: article.url,
            category: article.tag_list.includes('javascript') ? 'Technical' : 'Interview',
            date: article.published_at,
            image: article.cover_image
          }));
          dispatch(setBlogs(formattedBlogs));
        } else {
          dispatch(setBlogs(getMockBlogs()));
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        dispatch(setBlogs(getMockBlogs()));
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, [dispatch]);

  // Mock data generator (fallback)
  const getMockQuestions = (category) => {
    const allQuestions = {
      frontend: [
        { id: "1", question: "What is the Virtual DOM in React?", category: "frontend", difficulty: "medium", answer: "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses it to optimize updates by calculating the minimal set of changes needed before updating the real DOM." },
        { id: "2", question: "Explain React Hooks", category: "frontend", difficulty: "medium", answer: "Hooks are functions that let you use state and other React features without writing a class. Common hooks include useState, useEffect, useContext, and useReducer." },
        { id: "3", question: "What is CSS Box Model?", category: "frontend", difficulty: "easy", answer: "The CSS box model consists of content, padding, border, and margin. It determines how elements are sized and spaced on a webpage." },
        { id: "4", question: "Difference between var, let, and const?", category: "frontend", difficulty: "easy", answer: "var has function scope and is hoisted, let has block scope and isn't hoisted, const is like let but the binding is immutable." },
        { id: "5", question: "What is closure in JavaScript?", category: "frontend", difficulty: "hard", answer: "A closure is a function that remembers and accesses variables from its outer scope even after the outer function has finished executing." },
        { id: "6", question: "Explain event delegation", category: "frontend", difficulty: "medium", answer: "Event delegation leverages event bubbling to handle events at a parent level rather than individual child elements, improving performance." },
        { id: "7", question: "What is Redux?", category: "frontend", difficulty: "medium", answer: "Redux is a predictable state container for JavaScript apps, providing centralized state management with a unidirectional data flow." },
        { id: "8", question: "Explain CSS Flexbox", category: "frontend", difficulty: "easy", answer: "Flexbox is a layout model that provides an efficient way to lay out, align, and distribute space among items in a container." },
        { id: "9", question: "What are Web Components?", category: "frontend", difficulty: "hard", answer: "Web Components are a set of web platform APIs allowing you to create custom, reusable, encapsulated HTML tags." },
        { id: "10", question: "Difference between == and ===?", category: "frontend", difficulty: "easy", answer: "== performs type coercion before comparison, while === checks both value and type without coercion." },
        { id: "11", question: "What is webpack?", category: "frontend", difficulty: "medium", answer: "Webpack is a module bundler that processes and bundles JavaScript files and other assets for web applications." },
        { id: "12", question: "Explain async/await", category: "frontend", difficulty: "medium", answer: "Async/await is syntactic sugar for promises, making asynchronous code easier to write and read." },
      ],
      backend: [
        { id: "13", question: "What is REST API?", category: "backend", difficulty: "easy", answer: "REST is an architectural style for designing networked applications using HTTP methods and stateless communication." },
        { id: "14", question: "Explain database indexing", category: "backend", difficulty: "medium", answer: "Database indexing creates a data structure that improves data retrieval speed at the cost of additional storage and slower writes." },
        { id: "15", question: "What is middleware?", category: "backend", difficulty: "medium", answer: "Middleware is software that connects different applications or services, providing services like authentication, logging, and error handling." },
        { id: "16", question: "Explain JWT authentication", category: "backend", difficulty: "medium", answer: "JWT (JSON Web Token) is a compact way to securely transmit information between parties as a JSON object." },
        { id: "17", question: "What is database normalization?", category: "backend", difficulty: "hard", answer: "Normalization is the process of organizing database tables to reduce redundancy and improve data integrity." },
        { id: "18", question: "Explain CORS", category: "backend", difficulty: "medium", answer: "CORS (Cross-Origin Resource Sharing) is a security feature that controls how web pages from one domain can access resources from another domain." },
        { id: "19", question: "What is caching?", category: "backend", difficulty: "easy", answer: "Caching stores frequently accessed data in fast-access storage to improve application performance." },
        { id: "20", question: "Explain database transactions", category: "backend", difficulty: "hard", answer: "A transaction is a sequence of database operations that must all succeed or fail together, ensuring data consistency." },
      ],
      fullstack: [
        { id: "21", question: "Explain microservices architecture", category: "fullstack", difficulty: "hard", answer: "Microservices is an architectural pattern where an application is composed of loosely coupled, independently deployable services." },
        { id: "22", question: "What is CI/CD?", category: "fullstack", difficulty: "medium", answer: "CI/CD (Continuous Integration/Continuous Deployment) automates the process of testing, building, and deploying code changes." },
        { id: "23", question: "Explain Docker", category: "fullstack", difficulty: "medium", answer: "Docker is a platform for developing, shipping, and running applications in isolated containers." },
        { id: "24", question: "What is GraphQL?", category: "fullstack", difficulty: "medium", answer: "GraphQL is a query language for APIs that allows clients to request exactly the data they need." },
        { id: "25", question: "Explain serverless architecture", category: "fullstack", difficulty: "hard", answer: "Serverless architecture allows building applications without managing servers, using cloud functions that scale automatically." },
        { id: "26", question: "What is OAuth?", category: "fullstack", difficulty: "medium", answer: "OAuth is an authorization framework that enables third-party applications to access user data without exposing passwords." },
        { id: "27", question: "Explain load balancing", category: "fullstack", difficulty: "hard", answer: "Load balancing distributes network traffic across multiple servers to ensure reliability and performance." },
        { id: "28", question: "What is WebSocket?", category: "fullstack", difficulty: "medium", answer: "WebSocket is a protocol providing full-duplex communication channels over a single TCP connection." },
      ],
      behavioral: [
        { id: "29", question: "Tell me about yourself", category: "behavioral", difficulty: "easy", answer: "Structure: Current role â†’ Key achievements â†’ Why you're interested in this position. Keep it concise (2-3 minutes)." },
        { id: "30", question: "Why do you want to work here?", category: "behavioral", difficulty: "easy", answer: "Research the company's mission, values, and recent projects. Connect your skills and goals to their needs." },
        { id: "31", question: "Describe a challenging project", category: "behavioral", difficulty: "medium", answer: "Use STAR method: Situation (context), Task (your role), Action (what you did), Result (outcome and learnings)." },
        { id: "32", question: "How do you handle conflict?", category: "behavioral", difficulty: "medium", answer: "Focus on listening, understanding different perspectives, finding common ground, and working toward a solution." },
        { id: "33", question: "Where do you see yourself in 5 years?", category: "behavioral", difficulty: "easy", answer: "Show ambition aligned with the role, mention skill development, leadership goals, and how it matches the company's trajectory." },
        { id: "34", question: "Describe a time you failed", category: "behavioral", difficulty: "hard", answer: "Be honest, focus on what you learned, and how you applied those lessons to improve." },
        { id: "35", question: "Why should we hire you?", category: "behavioral", difficulty: "medium", answer: "Highlight unique skills, relevant experience, and cultural fit. Show enthusiasm and how you'll add value." },
        { id: "36", question: "Tell me about a time you showed leadership", category: "behavioral", difficulty: "medium", answer: "Use STAR method: Show initiative, how you motivated others, and the positive outcome achieved." },
      ],
    };
    return allQuestions[category] || [];
  };

  const getMockBlogs = () => [
    { id: "1", title: "Mastering React Interviews", excerpt: "Top React questions and how to answer them effectively", url: "#", category: "Technical", date: "2024-12-15" },
    { id: "2", title: "System Design Interview Guide", excerpt: "Everything you need to know about system design interviews", url: "#", category: "Technical", date: "2024-12-14" },
    { id: "3", title: "Behavioral Interview Success", excerpt: "STAR method and example answers for common questions", url: "#", category: "Behavioral", date: "2024-12-13" },
    { id: "4", title: "Data Structures Deep Dive", excerpt: "Essential DS&A concepts for technical interviews", url: "#", category: "Technical", date: "2024-12-12" },
  ];

  const toggleQuestion = (id) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "bg-green-500 text-white",
      medium: "bg-yellow-500 text-black",
      hard: "bg-red-500 text-white",
    };
    return colors[difficulty] || "bg-gray-500";
  };

  const getCategoryIcon = (categoryValue) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.icon || FaBookOpen;
  };

  const getCategoryColor = (categoryValue) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.color || "text-gray-500";
  };

  const paginatedQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
        {/* Header */}
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <FaBookOpen />
                Practice Resources
              </h1>
              <p className="text-lg opacity-90">
                Interview questions and preparation materials
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Questions Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaCode className="text-blue-500" />
                    Interview Questions
                  </CardTitle>
                  <CardDescription>
                    Select a category to view relevant interview questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Category Selector */}
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => dispatch(setCategory(value))}
                  >
                    <SelectTrigger className="w-full mb-6">
                      <SelectValue placeholder="Select category">
                        {selectedCategory && (
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon = getCategoryIcon(selectedCategory);
                              return <Icon className={getCategoryColor(selectedCategory)} />;
                            })()}
                            <span>
                              {categories.find(c => c.value === selectedCategory)?.label}
                            </span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <Icon className={category.color} />
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  {/* Loading State */}
                  {loading ? (
                    <div className="text-center py-12">
                      <p>Loading questions...</p>
                    </div>
                  ) : (
                    <>
                      {/* Questions List */}
                      <div className="space-y-4">
                        {paginatedQuestions.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No questions available for this category
                          </p>
                        ) : (
                          paginatedQuestions.map((question, index) => {
                            const Icon = getCategoryIcon(question.category);
                            const isExpanded = expandedQuestions.has(question.id);
                            return (
                              <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                              >
                                <Card className="hover:shadow-lg transition-shadow">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3 flex-1">
                                        <Icon className={`${getCategoryColor(question.category)} mt-1 flex-shrink-0`} />
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Badge className={getDifficultyColor(question.difficulty)}>
                                              {question.difficulty}
                                            </Badge>
                                          </div>
                                          <button
                                            onClick={() => toggleQuestion(question.id)}
                                            className="text-left w-full group"
                                          >
                                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                              {question.question}
                                            </h3>
                                          </button>
                                          {isExpanded && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              className="mt-3 text-muted-foreground bg-secondary/50 p-3 rounded-lg"
                                            >
                                              {question.answer}
                                            </motion.div>
                                          )}
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => toggleQuestion(question.id)}
                                        className="flex-shrink-0 text-primary"
                                      >
                                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                      </button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            );
                          })
                        )}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-6">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => currentPage > 1 && dispatch(setPage(currentPage - 1))}
                                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>
                              {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                  <PaginationLink
                                    onClick={() => dispatch(setPage(i + 1))}
                                    isActive={currentPage === i + 1}
                                    className="cursor-pointer"
                                  >
                                    {i + 1}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => currentPage < totalPages && dispatch(setPage(currentPage + 1))}
                                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Blogs Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaBookOpen className="text-purple-500" />
                    Preparation Blogs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {blogsLoading ? (
                    <p className="text-center text-muted-foreground">Loading blogs...</p>
                  ) : (
                    <div className="space-y-4">
                      {blogs.map((blog, index) => (
                        <motion.div
                          key={blog.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <Badge className="mb-2">{blog.category}</Badge>
                              <h3 className="font-semibold mb-2 line-clamp-2">
                                {blog.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {blog.excerpt}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(blog.date).toLocaleDateString()}
                                </span>
                                <a
                                  href={blog.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                  Read more <FaExternalLinkAlt className="h-3 w-3" />
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
