
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
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
          <h1 className="text-3xl font-bold mb-6 border-b pb-3 border-border">Terms of Service</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using GenAnime service, you agree to be bound by these Terms of Service. 
                If you do not agree to these Terms, you should not use the service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground">
                GenAnime provides a platform for users to discover, browse, and access information about anime content.
                The service may include links to third-party websites, services, or content that are not owned or controlled by GenAnime.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Conduct</h2>
              <p className="text-muted-foreground mb-3">
                You agree not to use the service to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Distribute malware or other harmful content</li>
                <li>Attempt to gain unauthorized access to any portion of the service</li>
                <li>Use the service in any way that could damage, disable, or impair the service</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content included on GenAnime, such as text, graphics, logos, and software, is the property of
                GenAnime or its content suppliers and is protected by copyright laws. The compilation of all content
                on this site is the exclusive property of GenAnime.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                The service is provided on an "as is" and "as available" basis. GenAnime makes no representations
                or warranties of any kind, express or implied, regarding the operation of the service or the
                information, content, materials, or products included on the service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                GenAnime shall not be liable for any damages of any kind arising from the use of the service,
                including, but not limited to, direct, indirect, incidental, punitive, and consequential damages.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
              <p className="text-muted-foreground">
                GenAnime reserves the right to modify these Terms of Service at any time. Your continued use of
                the service after any such changes constitutes your acceptance of the new Terms of Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
                in which GenAnime operates, without giving effect to any principles of conflicts of law.
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

export default TermsOfService;
