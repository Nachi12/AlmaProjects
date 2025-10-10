import { Link } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { FaRocket, FaUserGraduate, FaBriefcase, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

// ---------------------- MAIN COMPONENT ----------------------
const Index = () => {
  // ---------------------- FEATURES DATA ----------------------
  // Each feature card includes an icon, title, and short description
  const features = [
    {
      icon: FaUserGraduate,
      title: "Expert Interviewers",
      description: "Practice with professionals from top tech companies",
    },
    {
      icon: FaBriefcase,
      title: "Real Interview Experience",
      description: "Simulate actual interview conditions and scenarios",
    },
    {
      icon: FaChartLine,
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics",
    },
  ];

  // ---------------------- TESTIMONIALS (Not Rendered Yet) ----------------------
  // These can be displayed later in a testimonials section if needed
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Software Engineer at Google",
      content: "connect helped me prepare for my dream job. The mock interviews were incredibly realistic!",
    },
    {
      name: "Priya Patel",
      role: "Frontend Developer at Meta",
      content: "The feedback I received was invaluable. I improved my interview skills significantly.",
    },
    {
      name: "Marcus Johnson",
      role: "Full Stack Developer at Amazon",
      content: "Best platform for interview preparation. The resources section is comprehensive and helpful.",
    },
  ];

  // ---------------------- RENDER UI ----------------------
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)]">
        {/* ---------------------- HERO SECTION ---------------------- */}
        <section>
          {/* Background hero image */}
          <img 
            src="/HeroSection.jpg" 
            class="w-screen lg:h-[520px] md:h-[200px] sm:h-[130px]" 
            alt="Hero Section" 
          />

          {/* Hero Text and Buttons */}
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Prepare For With Excellence
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Practice with industry experts and land your dream job
              </p>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Signup Button */}
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-primary border-2 border-gray-100 hover:bg-[#2993FB] hover:text-white"
                  >
                    <FaRocket className="mr-2 h-5 w-5" />
                    Get Started Free
                  </Button>
                </Link>

                {/* Learn More Button */}
                <Link to="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white bg-[#181818] hover:bg-white hover:text-black"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------- FEATURES SECTION ---------------------- */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}  // animation start
              animate={{ opacity: 1, y: 0 }}   // animation end
              transition={{ duration: 0.5, delay: 0.2 }} // animation timing
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose connect?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform provides everything you need to succeed in your technical interviews
              </p>
            </motion.div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}   // fade up animation
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <CardContent className="p-8 text-center">
                      {/* Feature Icon */}
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#2993FB] rounded-full flex items-center justify-center">
                        <feature.icon className="h-8 w-8 text-primary-foreground" />
                      </div>

                      {/* Feature Title */}
                      <h3 className="text-xl font-semibold mb-3">
                        {feature.title}
                      </h3>

                      {/* Feature Description */}
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* ---------------------- CALL TO ACTION (CTA) SECTION ---------------------- */}
        <section className="py-20 bg-gradient-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            {/* CTA Message */}
            <div
              initial={{ opacity: 0, y: 20 }}   // fade up entry animation
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2993FB]">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-[#181818]">
                Join connect today and take the first step towards your dream career
              </p>

              {/* CTA Button */}
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-primary hover:text-white border-2 border-black-300 hover:border-0"
                >
                  <FaRocket className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

// Export main page component
export default Index;
