// ============================================================================
// Leaderboard Page - Full trader rankings
// ============================================================================

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Leaderboard } from '@/components/copy-trading/Leaderboard';
import { useTopTraders } from '@/hooks/use-copy-trading';
import { WalletConnect } from '@/components/WalletConnect';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react';

type TimePeriod = '24h' | '7d' | '30d' | 'all';
type Category = 'all' | 'crypto' | 'sports' | 'politics' | 'entertainment';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<TimePeriod>('7d');
  const [category, setCategory] = useState<Category>('all');

  const { data: traders, isLoading } = useTopTraders({
    period,
    category: category === 'all' ? undefined : category,
    limit: 50,
  });

  const periods: { value: TimePeriod; label: string }[] = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'all', label: 'All Time' },
  ];

  const categories: { value: Category; label: string; icon: string }[] = [
    { value: 'all', label: 'All Markets', icon: '🌐' },
    { value: 'crypto', label: 'Crypto', icon: '₿' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    { value: 'politics', label: 'Politics', icon: '🗳️' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>

              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Leaderboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Top performing traders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Traders
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {traders?.length || 0}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Avg Win Rate
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {traders && traders.length > 0
                      ? `${(traders.reduce((sum, t) => sum + t.stats.winRate, 0) / traders.length).toFixed(1)}%`
                      : '0%'}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Volume
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    $2.4M+
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-lg p-6 mb-6 border border-border">
            {/* Time Period Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Time Period
              </label>
              <div className="flex flex-wrap gap-2">
                {periods.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setPeriod(p.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      period === p.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      category === cat.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">
              Top Traders - {periods.find(p => p.value === period)?.label}
            </h2>

            <Leaderboard
              traders={traders || []}
              loading={isLoading}
              onFollowTrader={id => console.log('Follow trader:', id)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
