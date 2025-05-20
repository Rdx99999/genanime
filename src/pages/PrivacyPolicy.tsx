
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-xl p-8 shadow-lg border border-primary/10"
        >
          <h1 className="text-3xl font-bold mb-6 border-b pb-3 border-border">Privacy Policy</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-3">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Information you provide to us, such as your name and email address</li>
                <li>Automatically collected information, such as your IP address and browser information</li>
                <li>Information about your interactions with our service</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-3">
                We may use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Providing, maintaining, and improving our service</li>
                <li>Personalizing your experience</li>
                <li>Communicating with you</li>
                <li>Analyzing usage patterns</li>
                <li>Protecting against unauthorized access and fraud</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Cookies and Similar Technologies</h2>
              <p className="text-muted-foreground">
                We may use cookies and similar tracking technologies to collect information about your
                activity, browser, and device. You can instruct your browser to refuse all cookies or to indicate
                when a cookie is being sent.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Information Sharing</h2>
              <p className="text-muted-foreground">
                We do not share your personal information with third parties except as described in this policy.
                We may share information with service providers who perform services on our behalf, when required by law,
                or in connection with a merger, acquisition, or sale of all or a portion of our assets.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
              <p className="text-muted-foreground">
                We take reasonable measures to help protect your personal information from loss, theft, misuse,
                unauthorized access, disclosure, alteration, and destruction. However, no method of transmission
                over the Internet or method of electronic storage is 100% secure.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our service is not directed to children under 13, and we do not knowingly collect personal
                information from children under 13. If we learn we have collected personal information from a
                child under 13, we will delete this information.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our Privacy Policy, please contact us through the information
                provided on our Contact page.
              </p>
            </section>
          </div>
          
          <div className="mt-8 pt-4 border-t border-border text-sm text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
