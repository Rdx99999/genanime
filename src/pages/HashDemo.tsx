
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { hashUtils } from '@/lib/hashUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, RefreshCw, ShieldCheck, Shield, Lock } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HashDemo = () => {
  const [input, setInput] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [sha512Hash, setSha512Hash] = useState('');
  const [ripemd160Hash, setRipemd160Hash] = useState('');
  const [hmacKey, setHmacKey] = useState('secret-key');
  const [hmacHash, setHmacHash] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [isComputing, setIsComputing] = useState(false);

  useEffect(() => {
    if (input) {
      setIsComputing(true);
      
      // Simulate computation delay for visual effect
      const timer = setTimeout(() => {
        setSha256Hash(hashUtils.sha256(input));
        setSha512Hash(hashUtils.sha512(input));
        setRipemd160Hash(hashUtils.ripemd160(input));
        setHmacHash(hashUtils.hmacSha256(input, hmacKey));
        setIsComputing(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSha256Hash('');
      setSha512Hash('');
      setRipemd160Hash('');
      setHmacHash('');
      setIsComputing(false);
    }
  }, [input, hmacKey]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateRandomInput = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = Math.floor(Math.random() * 20) + 10;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setInput(result);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <Navbar />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4 w-16 h-16 rounded-full bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Hash Functions Demo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the power of cryptographic hash functions with the @noble/hashes library.
              Generate secure hashes for any input text.
            </p>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
              <Card className="h-full border-primary/10 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Input Text
                  </CardTitle>
                  <CardDescription>
                    Enter some text to generate various hash values
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="input-text" className="text-sm font-medium flex items-center gap-2">
                        <span>Text to hash</span>
                        {isComputing && (
                          <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                        )}
                      </Label>
                      <div className="relative">
                        <Input 
                          id="input-text" 
                          placeholder="Enter text to hash..." 
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="pr-10 font-mono text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-7 w-7 p-0"
                          onClick={() => setInput('')}
                          disabled={!input}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hmac-key" className="text-sm font-medium">HMAC Secret Key</Label>
                      <Input 
                        id="hmac-key" 
                        placeholder="Secret key for HMAC" 
                        value={hmacKey}
                        onChange={(e) => setHmacKey(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-border/50 pt-4">
                  <Button
                    variant="outline"
                    onClick={generateRandomInput}
                    className="text-xs"
                  >
                    Generate Random Input
                  </Button>
                  <Button
                    onClick={() => {
                      setInput('');
                      setHmacKey('secret-key');
                    }}
                    variant="ghost"
                    className="text-xs"
                  >
                    Reset All
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants} className="col-span-1">
              <Card className="h-full border-primary/10 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Hash Info
                  </CardTitle>
                  <CardDescription>
                    About cryptographic hashing
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="min-w-5 text-primary mt-0.5">•</div>
                      <span>Hash functions convert data of any size to fixed-length strings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="min-w-5 text-primary mt-0.5">•</div>
                      <span>Same input always produces the same output</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="min-w-5 text-primary mt-0.5">•</div>
                      <span>Impossible to reverse the process (one-way function)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="min-w-5 text-primary mt-0.5">•</div>
                      <span>Used for password storage, data integrity verification, and digital signatures</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tabs defaultValue="sha256" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 w-full bg-card border border-primary/10">
                <TabsTrigger value="sha256" className="data-[state=active]:bg-primary/10">SHA-256</TabsTrigger>
                <TabsTrigger value="sha512" className="data-[state=active]:bg-primary/10">SHA-512</TabsTrigger>
                <TabsTrigger value="ripemd160" className="data-[state=active]:bg-primary/10">RIPEMD-160</TabsTrigger>
                <TabsTrigger value="hmac" className="data-[state=active]:bg-primary/10">HMAC</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sha256">
                <Card className="border-primary/10 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>SHA-256 Hash</CardTitle>
                        <CardDescription>
                          SHA-256 is part of the SHA-2 family of cryptographic hash functions
                        </CardDescription>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
                        256 bits
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="relative">
                      <div className={`p-4 bg-muted rounded-md overflow-auto break-all font-mono text-sm h-20 flex items-center transition-opacity ${isComputing ? 'opacity-50' : ''}`}>
                        {sha256Hash || 'Enter text to generate hash...'}
                      </div>
                      {isComputing && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      )}
                      {sha256Hash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-8 w-8 p-0"
                          onClick={() => handleCopy(sha256Hash, 'sha256')}
                        >
                          {copied === 'sha256' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <h4 className="text-sm font-medium mb-2">Common Uses:</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Digital Signatures</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">SSL Certificates</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Git Version Control</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sha512">
                <Card className="border-primary/10 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>SHA-512 Hash</CardTitle>
                        <CardDescription>
                          SHA-512 produces a 512-bit (64-byte) hash value
                        </CardDescription>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
                        512 bits
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="relative">
                      <div className={`p-4 bg-muted rounded-md overflow-auto break-all font-mono text-sm h-20 flex items-center transition-opacity ${isComputing ? 'opacity-50' : ''}`}>
                        {sha512Hash || 'Enter text to generate hash...'}
                      </div>
                      {isComputing && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      )}
                      {sha512Hash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-8 w-8 p-0"
                          onClick={() => handleCopy(sha512Hash, 'sha512')}
                        >
                          {copied === 'sha512' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <h4 className="text-sm font-medium mb-2">Common Uses:</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Password Storage</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">TLS/SSL</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Military-grade Security</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ripemd160">
                <Card className="border-primary/10 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>RIPEMD-160 Hash</CardTitle>
                        <CardDescription>
                          RIPEMD-160 produces a 160-bit output
                        </CardDescription>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
                        160 bits
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="relative">
                      <div className={`p-4 bg-muted rounded-md overflow-auto break-all font-mono text-sm h-20 flex items-center transition-opacity ${isComputing ? 'opacity-50' : ''}`}>
                        {ripemd160Hash || 'Enter text to generate hash...'}
                      </div>
                      {isComputing && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      )}
                      {ripemd160Hash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-8 w-8 p-0"
                          onClick={() => handleCopy(ripemd160Hash, 'ripemd160')}
                        >
                          {copied === 'ripemd160' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <h4 className="text-sm font-medium mb-2">Common Uses:</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Bitcoin Addresses</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Blockchain</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">European eID Systems</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="hmac">
                <Card className="border-primary/10 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>HMAC-SHA256</CardTitle>
                        <CardDescription>
                          HMAC provides a way to check both data integrity and authenticity
                        </CardDescription>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
                        Keyed Hash
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="relative">
                      <div className={`p-4 bg-muted rounded-md overflow-auto break-all font-mono text-sm h-20 flex items-center transition-opacity ${isComputing ? 'opacity-50' : ''}`}>
                        {hmacHash || 'Enter text to generate hash...'}
                      </div>
                      {isComputing && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      )}
                      {hmacHash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-8 w-8 p-0"
                          onClick={() => handleCopy(hmacHash, 'hmac')}
                        >
                          {copied === 'hmac' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <h4 className="text-sm font-medium mb-2">Common Uses:</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">API Authentication</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Message Auth</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">JWT Tokens</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default HashDemo;
