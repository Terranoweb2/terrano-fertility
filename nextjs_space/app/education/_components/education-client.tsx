
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  Clock, 
  Tag,
  Heart,
  Brain,
  Leaf,
  Activity,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface EducationalContent {
  id: string;
  title: string;
  category: string;
  content: string;
  summary?: string;
  tags: string[];
  readTime?: number;
  publishedAt: string;
}

export default function EducationClient() {
  const [articles, setArticles] = useState<EducationalContent[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<EducationalContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<EducationalContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEducationalContent();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, selectedCategory, searchQuery]);

  const fetchEducationalContent = async () => {
    try {
      const response = await fetch('/api/education');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching educational content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(article => article.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered?.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary?.toLowerCase().includes(query) ||
        article.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cycle-basics':
        return <Calendar className="w-5 h-5 text-pink-600" />;
      case 'fertility':
        return <Heart className="w-5 h-5 text-red-600" />;
      case 'symptoms':
        return <Activity className="w-5 h-5 text-blue-600" />;
      case 'nutrition':
        return <Leaf className="w-5 h-5 text-green-600" />;
      case 'lifestyle':
        return <Brain className="w-5 h-5 text-purple-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'cycle-basics':
        return 'Bases du cycle';
      case 'fertility':
        return 'Fertilité';
      case 'symptoms':
        return 'Symptômes';
      case 'nutrition':
        return 'Nutrition';
      case 'lifestyle':
        return 'Mode de vie';
      default:
        return category;
    }
  };

  const categories = ['all', 'cycle-basics', 'fertility', 'symptoms', 'nutrition', 'lifestyle'];

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux articles
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-4 mb-6">
              {getCategoryIcon(selectedArticle.category)}
              <Badge variant="secondary">{getCategoryName(selectedArticle.category)}</Badge>
              {selectedArticle.readTime && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{selectedArticle.readTime} min</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
            
            {selectedArticle.summary && (
              <p className="text-lg text-gray-600 mb-6 italic">{selectedArticle.summary}</p>
            )}

            <div className="prose prose-lg max-w-none">
              {selectedArticle.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                      {paragraph.slice(2, -2)}
                    </h3>
                  );
                }
                return paragraph.trim() ? (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ) : null;
              })}
            </div>

            {selectedArticle.tags?.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center space-x-2 flex-wrap">
                  <Tag className="w-4 h-4 text-gray-500" />
                  {selectedArticle.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Button>
              </Link>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Éducation & Ressources</h1>
                <p className="text-sm text-gray-600">Apprenez sur la fertilité et votre corps</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher des articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? 'bg-gradient-to-r from-green-500 to-blue-500' : ''}
                  >
                    {category === 'all' ? 'Tous' : getCategoryName(category)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Chargement des articles...</p>
          </div>
        ) : filteredArticles?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? "Essayez avec d'autres mots-clés" 
                  : "Aucun article disponible dans cette catégorie"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles?.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => setSelectedArticle(article)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(article.category)}
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryName(article.category)}
                        </Badge>
                      </div>
                      {article.readTime && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime} min</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-green-600 transition-colors">
                      {article.title}
                    </CardTitle>
                    {article.summary && (
                      <CardDescription className="line-clamp-3">
                        {article.summary}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {article.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {article.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full group-hover:bg-green-50 group-hover:text-green-700"
                    >
                      Lire l'article
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
