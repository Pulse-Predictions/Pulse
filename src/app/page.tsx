'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RainbowKitButton } from '@/components/RainbowKitButton';
import { MarketCard } from '@/components/MarketCard';
import { PredictionModal } from '@/components/PredictionModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  fetchMarkets,
  fetchMarketCategories,
  calculateMarketOdds,
} from '@/lib/market-data';
import { Market, MarketCategoryInfo } from '@/types/market';
import {
  TrendingUp,
  Zap,
  Shield,
  Sparkles,
  Search,
  Brain,
  Palette,
  Github,
} from 'lucide-react';

export default function HomePage() {
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [markets, setMarkets] = useState<Market[]>([]);
  const [categories, setCategories] = useState<MarketCategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchMarketCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Failed to load market categories');
      }
    };
    loadCategories();
  }, []);

  // Fetch markets when category or search changes
  useEffect(() => {
    const loadMarkets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMarkets(selectedCategory, searchQuery);
        setMarkets(data);
      } catch (err) {
        console.error('Failed to load markets:', err);
        setError('Failed to load markets. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadMarkets();
  }, [selectedCategory, searchQuery]);

  const selectedMarket = markets.find(m => m.id === selectedMarketId);
  const filteredMarkets = markets.filter(market => {
    const matchesCategory =
      selectedCategory === 'all' || market.category === selectedCategory;
    const matchesSearch =
      market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePredictionSubmit = async (position: boolean, amount: string) => {
    console.log('Prediction submitted:', {
      marketId: selectedMarketId,
      position,
      amount,
    });
    // TODO: Implement smart contract interaction
    // Call contract method to place prediction
    try {
      // const tx = await placePrediction(selectedMarketId, position, amount);
      // await tx.wait();
      alert(
        `Prediction placed! Position: ${position ? 'YES' : 'NO'}, Amount: ${amount} BNB`
      );
      setSelectedMarketId(null);
      // Refresh markets after successful prediction
      const data = await fetchMarkets(selectedCategory, searchQuery);
      setMarkets(data);
    } catch (err) {
      console.error('Failed to place prediction:', err);
      alert('Failed to place prediction. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center p-2">
                <Image
                  src="/logo.png"
                  alt="Pulse Logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Pulse</h1>
                <p className="text-xs text-muted-foreground">
                  Powered by BNB Chain
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://x.com/PulseBSC"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-colors"
                aria-label="Follow us on X"
              >
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/Pulse-Predictions/Pulse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-colors"
                aria-label="View on GitHub"
              >
                <Github className="h-5 w-5 text-primary" />
              </a>
              <ThemeToggle />
              <RainbowKitButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-bnb/10 border border-bnb/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-bnb" />
            <span className="text-sm font-semibold text-bnb">
              Seedify Hackathon 2025 • $400K Prize Pool
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            AI-Powered Prediction Markets on{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BNB Chain
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Predict the future of creative work. Trade predictions with AI
            assistance and gasless transactions.
          </p>

          {/* New: Creative Markets CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/creative-markets">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Palette className="h-5 w-5" />
                Explore Creative Markets
                <Sparkles className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <TrendingUp className="h-5 w-5" />
                View Leaderboard
              </Button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="p-4 bg-card backdrop-blur rounded-lg border border-border hover:border-primary/50 transition-colors">
              <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">AI Oracle</h3>
              <p className="text-sm text-muted-foreground">
                Subjective judging in minutes, not days
              </p>
            </div>
            <div className="p-4 bg-card backdrop-blur rounded-lg border border-border hover:border-success/50 transition-colors">
              <Zap className="h-8 w-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">
                Gasless Trading
              </h3>
              <p className="text-sm text-muted-foreground">
                No crypto knowledge needed
              </p>
            </div>
            <div className="p-4 bg-card backdrop-blur rounded-lg border border-border hover:border-primary/50 transition-colors">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">
                Pooled Liquidity
              </h3>
              <p className="text-sm text-muted-foreground">
                45% better pricing
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI-Assisted Oracles</CardTitle>
              <CardDescription>
                Fast market resolution with AI-powered data analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our advanced AI oracle system analyzes multiple data sources to
                provide faster, more accurate market resolutions compared to
                traditional methods.
              </p>
            </CardContent>
          </Card>

          <Card className="border hover:border-success transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <CardTitle>Gasless Transactions</CardTitle>
              <CardDescription>
                No gas fees with account abstraction technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Trade without worrying about gas fees. Our account abstraction
                layer makes prediction markets accessible to everyone.
              </p>
            </CardContent>
          </Card>

          <Card className="border hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Deep Liquidity</CardTitle>
              <CardDescription>
                Aggregated liquidity pools for better trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our liquidity aggregation technology ensures competitive odds
                and minimal slippage across all markets.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Market Categories */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-foreground">
            Browse Markets
          </h3>
          <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              All Markets
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Markets Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading markets...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map(market => (
              <MarketCard
                key={market.id}
                market={market}
                onPredict={setSelectedMarketId}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No markets found matching your criteria.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
              <a
                href="https://x.com/PulseBSC"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on X"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-sm font-medium">@PulseBSC</span>
              </a>
              <a
                href="https://github.com/Pulse-Predictions/Pulse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="View on GitHub"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm font-medium">Pulse-Predictions</span>
              </a>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                Built for Seedify Prediction Markets Hackathon 2025 • Powered by
                BNB Chain
              </p>
              <p className="text-xs">
                🏆 YZi Labs Track: AI Oracles + Gasless UX + Liquidity
                Aggregation
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Prediction Modal */}
      {selectedMarket && (
        <PredictionModal
          marketId={selectedMarket.id}
          question={selectedMarket.question}
          yesOdds={
            calculateMarketOdds(
              selectedMarket.totalYesAmount,
              selectedMarket.totalNoAmount
            ).yesOdds
          }
          noOdds={
            calculateMarketOdds(
              selectedMarket.totalYesAmount,
              selectedMarket.totalNoAmount
            ).noOdds
          }
          onClose={() => setSelectedMarketId(null)}
          onSubmit={handlePredictionSubmit}
        />
      )}
    </div>
  );
}
