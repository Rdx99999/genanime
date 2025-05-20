
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminNavbar from '@/components/AdminNavbar';

const Documentation = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the README.md file
    fetch('/src/docs/README.md')
      .then(response => response.text())
      .then(text => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching documentation:', error);
        setLoading(false);
      });
  }, []);

  // Simple markdown parser for headers
  const parseMarkdown = (md: string) => {
    // Convert headers
    let parsedMd = md
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold my-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold my-2 mt-5">$1</h3>')
      // Convert paragraphs
      .replace(/^(?!<h[1-6]|<ul|<ol|<li|<p|<pre|<table)(.+$)/gm, '<p class="my-2">$1</p>')
      // Convert code blocks
      .split('```').map((block, i) => {
        if (i % 2 === 1) { // Inside code block
          return `<pre class="bg-secondary/30 p-4 rounded-md my-4 overflow-x-auto"><code>${block}</code></pre>`;
        }
        return block;
      }).join('');
    
    return parsedMd;
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-1" /> Home
              </Link>
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button variant="outline" size="sm">
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar navigation on larger screens */}
          <div className="hidden lg:block lg:col-span-3">
            <Card>
              <div className="p-4">
                <h3 className="font-medium mb-3">Documentation</h3>
                <nav className="space-y-1">
                  <a href="#overview" className="block p-2 hover:bg-secondary/50 rounded-md">Overview</a>
                  <a href="#architecture" className="block p-2 hover:bg-secondary/50 rounded-md">Architecture</a>
                  <a href="#core-features" className="block p-2 hover:bg-secondary/50 rounded-md">Core Features</a>
                  <a href="#database-schema" className="block p-2 hover:bg-secondary/50 rounded-md">Database Schema</a>
                  <a href="#technical-implementation" className="block p-2 hover:bg-secondary/50 rounded-md">Technical Implementation</a>
                  <a href="#getting-started-for-developers" className="block p-2 hover:bg-secondary/50 rounded-md">Getting Started</a>
                </nav>
              </div>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-9">
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div 
                    className="prose prose-invert max-w-none text-left" 
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
