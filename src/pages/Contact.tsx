
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { 
  Instagram, 
  MessageCircle, 
  Youtube, 
  Send, 
  Mail, 
  User
} from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-2"
        >
          Contact Us
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          Have questions or feedback? Get in touch with our team.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {/* Contact form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-xl p-6 shadow-lg border border-primary/10"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              Send us a message
            </h2>
            
            {submitted ? (
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-primary font-medium">Thank you for your message!</p>
                <p className="text-sm text-muted-foreground mt-1">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <Textarea 
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message here..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <span className="mr-2">Sending</span>
                      <span className="animate-spin">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
          
          {/* Connect with us */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl p-6 shadow-lg border border-primary/10">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                Connect With Us
              </h2>
              
              <div className="space-y-6">
                <a 
                  href="https://www.instagram.com/DARKXSIDE78" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-muted/50 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Instagram</h3>
                    <p className="text-sm text-muted-foreground">@DARKXSIDE78</p>
                  </div>
                </a>
                
                <a 
                  href="https://t.me/GenAnimeOfc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-muted/50 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <div className="bg-gradient-to-br from-sky-400 to-blue-600 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-white" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="m22 5-11 14L3 5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Telegram</h3>
                    <p className="text-sm text-muted-foreground">@GenAnimeOfc</p>
                  </div>
                </a>
                
                <a 
                  href="https://youtube.com/@GenMusic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-muted/50 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <div className="bg-gradient-to-br from-red-600 to-red-700 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                    <Youtube className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">YouTube</h3>
                    <p className="text-sm text-muted-foreground">@GenMusic</p>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-lg border border-primary/10">
              <h3 className="text-lg font-semibold mb-3">Our Mission</h3>
              <p className="text-muted-foreground text-sm">
                At GenAnime, we're passionate about bringing you the best anime content. 
                Our goal is to create a community where anime fans can discover, 
                share, and enjoy their favorite series.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
