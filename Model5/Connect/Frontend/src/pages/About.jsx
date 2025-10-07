import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Layout from "@/components/layout/Layout";
import { FaLinkedin, FaTwitter, FaGithub, FaRocket, FaBullseye, FaHandshake } from "react-icons/fa";
import { motion } from "framer-motion";

// ---------------------- MAIN ABOUT COMPONENT ----------------------
const About = () => {
  // ---------------------- TEAM DATA ----------------------
  // Information for team members displayed under "Our Team"
  const team = [
    {
      name: "Sarah Mitchell",
      role: "Co-Founder & CEO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      linkedin: "#",
      twitter: "#",
    },
  ];

  // ---------------------- FAQ DATA ----------------------
  // Commonly asked questions shown in an accordion format
  const faqs = [
    {
      question: "How does connect work?",
      answer:
        "connect connects students with experienced professionals for mock interviews. You can schedule interviews, receive feedback, and access practice resources all in one platform.",
    },
    {
      question: "What types of interviews are available?",
      answer:
        "We offer various interview types including Behavioral, Frontend, Backend, Full-Stack, and Data Structures & Algorithms interviews.",
    },
    {
      question: "How are interviewers selected?",
      answer:
        "Our interviewers are carefully vetted professionals with extensive industry experience from top tech companies.",
    },
    {
      question: "Can I reschedule an interview?",
      answer:
        "Yes, you can reschedule interviews up to 24 hours before the scheduled time through your dashboard.",
    },
    {
      question: "Is there a fee for using connect?",
      answer:
        "We offer both free and premium plans. The free plan includes basic features, while premium plans offer additional benefits like unlimited interviews and priority scheduling.",
    },
  ];

  // ---------------------- COMPANY VALUES ----------------------
  // Values represent the vision and mission principles of the platform
  const values = [
    {
      icon: FaRocket,
      title: "Innovation",
      description:
        "Constantly evolving our platform to provide the best interview preparation experience.",
    },
    {
      icon: FaBullseye,
      title: "Excellence",
      description:
        "Committed to delivering high-quality mock interviews and comprehensive feedback.",
    },
    {
      icon: FaHandshake,
      title: "Community",
      description:
        "Building a supportive community where students can learn and grow together.",
    },
  ];

  // ---------------------- RENDER UI ----------------------
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
        {/* ---------------------- HERO SECTION ---------------------- */}
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }} // fade-in animation from below
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About connect</h1>
              <p className="text-xl opacity-90">
                Empowering students to ace their interviews through practice and feedback
              </p>
            </motion.div>
          </div>
        </div>

        {/* ---------------------- MISSION SECTION ---------------------- */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  connect was founded with a simple yet powerful mission: to bridge the gap
                  between academic learning and industry expectations. We believe that every
                  student deserves the opportunity to practice and refine their interview
                  skills with experienced professionals. Our platform provides a safe,
                  supportive environment where students can gain confidence, receive
                  constructive feedback, and ultimately land their dream jobs.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* ---------------------- VALUES SECTION ---------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} // animated entry
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            {/* Mapping through values to display them as cards */}
            {values.map((value, index) => (
              <Card
                key={index}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  {/* Icon representing each value */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  {/* Title and Description */}
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* ---------------------- TEAM SECTION ---------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>

            {/* Centered single member (you can expand this grid later) */}
            <div className="w-84 flex justify-center">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <CardContent className="p-6 text-center">
                    {/* Member Profile Picture */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary p-1"
                    />

                    {/* Name and Role */}
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{member.role}</p>

                    {/* Social Media Links */}
                    <div className="flex justify-center gap-3">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          className="text-primary hover:text-primary/80"
                        >
                          <FaLinkedin className="h-5 w-5" />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          className="text-primary hover:text-primary/80"
                        >
                          <FaTwitter className="h-5 w-5" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          className="text-primary hover:text-primary/80"
                        >
                          <FaGithub className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* ---------------------- FAQ SECTION ---------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            {/* Accordion used for expandable FAQ items */}
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg px-4"
                >
                  {/* Each question */}
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-medium">{faq.question}</span>
                  </AccordionTrigger>

                  {/* Answer shown when expanded */}
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

// Export main About page
export default About;
