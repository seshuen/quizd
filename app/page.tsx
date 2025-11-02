'use client'

import { useAuth } from "@/lib/contexts/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { RecentQuizCard } from "@/components/home/RecentQuizCard";
import { FeaturedTopics } from "@/components/home/FeaturedTopics";
import { Loading } from "@/components/ui/Loading";
import { Database } from "@/lib/supabase/types";
import Link from "next/link";
import { FaPlay, FaArrowRight } from "react-icons/fa";

type Topic = Database['public']['Tables']['topics']['Row']

interface RecentQuiz {
  id: string
  topic_name: string
  topic_slug: string
  score: number
  correct_count: number
  questions_answered: number
  xp_earned: number
  completed_at: string
  total_time_seconds: number
}

export default function Home() {
  const { user, profile, loading: authLoading } = useAuth();
  const [recentQuiz, setRecentQuiz] = useState<RecentQuiz | null>(null);
  const [featuredTopics, setFeaturedTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchHomeData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch most recent completed quiz session with topic in one query
        const { data: sessionData, error: sessionError } = await supabase
          .from('game_sessions')
          .select(`
            id,
            score,
            correct_count,
            questions_answered,
            xp_earned,
            completed_at,
            total_time_seconds,
            topics!inner(name, slug)
          `)
          .eq('user_id', user.id)
          .eq('completed', true)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        if (sessionData && !sessionError) {
          setRecentQuiz({
            id: sessionData.id,
            topic_name: sessionData.topics.name,
            topic_slug: sessionData.topics.slug,
            score: sessionData.score || 0,
            correct_count: sessionData.correct_count || 0,
            questions_answered: sessionData.questions_answered || 0,
            xp_earned: sessionData.xp_earned || 0,
            completed_at: sessionData.completed_at || '',
            total_time_seconds: sessionData.total_time_seconds || 0,
          });
        }

        // Fetch featured topics (top 6 by play count)
        const { data: topicsData, error: topicsError } = await supabase
          .from('topics')
          .select('*')
          .order('play_count', { ascending: false })
          .limit(6);

        if (topicsData && !topicsError) {
          setFeaturedTopics(topicsData);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchHomeData();
    }
  }, [user, authLoading, supabase]);

  if (authLoading || loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Quizd</h1>
          <p className="text-xl text-gray-600 mb-8">
            Test your knowledge, track your progress, and level up your skills
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white text-gray-700 py-3 px-8 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.username || user.email}!
        </h1>
        <p className="text-gray-600">Ready to continue your learning journey?</p>
      </div>

      {/* Recent Quiz Section */}
      {recentQuiz && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Quiz</h2>
            <Link
              href="/profile"
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
            >
              View All
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="max-w-md">
            <RecentQuizCard quiz={recentQuiz} />
          </div>
        </div>
      )}

      {/* Featured Topics Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Topics</h2>
          <Link
            href="/topics"
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
          >
            Browse All
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
        {featuredTopics.length > 0 ? (
          <FeaturedTopics topics={featuredTopics} />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">No topics available yet</p>
            <Link
              href="/topics"
              className="inline-flex items-center bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <FaPlay className="mr-2" />
              Explore Topics
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
