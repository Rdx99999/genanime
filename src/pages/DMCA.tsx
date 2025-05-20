
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DMCA = () => {
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
          <h1 className="text-3xl font-bold mb-6 border-b pb-3 border-border">DMCA Policy</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Digital Millennium Copyright Act</h2>
              <p className="text-muted-foreground">
                GenAnime respects the intellectual property rights of others and expects its users to do the same.
                In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond promptly
                to claims of copyright infringement that are reported to the designated copyright agent identified below.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Notification of Claimed Infringement</h2>
              <p className="text-muted-foreground mb-3">
                If you believe that your work has been copied in a way that constitutes copyright infringement,
                please provide our copyright agent with the following information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest</li>
                <li>A description of the copyrighted work that you claim has been infringed</li>
                <li>A description of where the material that you claim is infringing is located on the site</li>
                <li>Your address, telephone number, and email address</li>
                <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law</li>
                <li>A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Counter-Notification</h2>
              <p className="text-muted-foreground mb-3">
                If you believe that your content that was removed (or to which access was disabled) is not infringing,
                or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law,
                to post and use the material in your content, you may send a counter-notification containing the following information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Your physical or electronic signature</li>
                <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled</li>
                <li>A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content</li>
                <li>Your name, address, telephone number, and email address, and a statement that you consent to the jurisdiction of the federal court in the district where you live (or the district where GenAnime is located if your address is outside of the United States), and a statement that you will accept service of process from the person who provided notification of the alleged infringement</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Repeat Infringers</h2>
              <p className="text-muted-foreground">
                GenAnime reserves the right to terminate the accounts of users who are repeat infringers of copyright.
                A repeat infringer is a user who has been notified of infringing activity more than twice and/or has had
                infringing content removed from the service more than twice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Contact Information</h2>
              <p className="text-muted-foreground">
                Please contact our designated copyright agent at the following email address for DMCA notifications:
                <a href="mailto:dmca@genanime.com" className="text-primary hover:underline ml-1">dmca@genanime.com</a>
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

export default DMCA;
