import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, CornerDownRight, Check, AlertCircle } from 'lucide-react';

interface ReviewSample {
  id: string;
  author: string;
  source: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: string;
  topics: string[];
}

const SAMPLES: ReviewSample[] = [
  {
    id: '1',
    author: 'Elena R.',
    source: 'Amazon Verified Purchase',
    text: 'Delivery was 5 days late and customer support refused my refund.',
    sentiment: 'negative',
    score: '94.2% negative',
    topics: ['delivery', 'pricing']
  },
  {
    id: '2',
    author: 'Marcus V.',
    source: 'Google Maps Review',
    text: 'Crystal clear audio and the battery easily lasts 30+ hours. Super happy.',
    sentiment: 'positive',
    score: '98.1% positive',
    topics: ['quality']
  },
  {
    id: '3',
    author: 'Sarah J.',
    source: 'Quarterly Survey',
    text: 'Standard device for daily office use. Average delivery time.',
    sentiment: 'neutral',
    score: '88.5% neutral',
    topics: []
  }
];

export const SentimentTransform: React.FC = () => {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'analyzing' | 'transformed'>('typing');
  const prefersReducedMotion = useRef(false);

  const currentSample = SAMPLES[sampleIndex];

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    // If reduced motion is requested, jump straight to transformed state
    if (prefersReducedMotion.current) {
      setTypedText(currentSample.text);
      setPhase('transformed');
      const timer = setTimeout(() => {
        setSampleIndex((prev) => (prev + 1) % SAMPLES.length);
      }, 4000);
      return () => clearTimeout(timer);
    }

    // Reset
    setTypedText('');
    setPhase('typing');

    let currentLength = 0;
    const fullText = currentSample.text;

    // Typing interval
    const typingInterval = setInterval(() => {
      currentLength++;
      setTypedText(fullText.slice(0, currentLength));

      if (currentLength >= fullText.length) {
        clearInterval(typingInterval);
        // Morph sequence
        setTimeout(() => {
          setPhase('analyzing');
          setTimeout(() => {
            setPhase('transformed');
            // Advance to next sample after displaying result
            setTimeout(() => {
              setSampleIndex((prev) => (prev + 1) % SAMPLES.length);
            }, 3800);
          }, 450);
        }, 500);
      }
    }, 28);

    return () => clearInterval(typingInterval);
  }, [sampleIndex]);

  return (
    <div className="w-full max-w-lg md-card p-6 sm:p-7 relative overflow-hidden transition-all duration-300">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
        <div className="flex items-center gap-2">
          {/* Google 4-color dots indicator */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
          </div>
          <span className="text-xs font-semibold text-text-secondary ml-1 tracking-wide font-sans">
            The Sentiment Transform
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-tertiary">
          <span className="w-2 h-2 rounded-full bg-pos animate-pulse" />
          <span>Live ML Inference</span>
        </div>
      </div>

      {/* Author & Source */}
      <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
        <span className="font-medium text-text-primary font-sans">{currentSample.author}</span>
        <span className="text-[11px] text-text-tertiary">{currentSample.source}</span>
      </div>

      {/* Typing & Processing Area */}
      <div className="min-h-[85px] flex flex-col justify-center">
        <p className="text-sm sm:text-base text-text-primary font-sans leading-relaxed">
          "{typedText}"
          {phase === 'typing' && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-brand animate-pulse align-middle" />
          )}
        </p>
      </div>

      {/* The Transform Transition & Output Pill */}
      <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {phase === 'analyzing' && (
          <div className="flex items-center gap-2 text-xs font-mono text-brand animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Classifying TF-IDF tokens...</span>
          </div>
        )}

        {phase === 'transformed' && (
          <div className="flex flex-wrap items-center gap-2 animate-in fade-in duration-300 w-full justify-between">
            {/* Signature Sentiment Pill in Google Brand Color */}
            <div>
              {currentSample.sentiment === 'positive' && (
                <span className="sentiment-pill sentiment-pill-pos">
                  <span className="w-1.5 h-1.5 rounded-full bg-pos" />
                  <span>{currentSample.score}</span>
                </span>
              )}
              {currentSample.sentiment === 'neutral' && (
                <span className="sentiment-pill sentiment-pill-neu">
                  <span className="w-1.5 h-1.5 rounded-full bg-neu" />
                  <span>{currentSample.score}</span>
                </span>
              )}
              {currentSample.sentiment === 'negative' && (
                <span className="sentiment-pill sentiment-pill-neg">
                  <span className="w-1.5 h-1.5 rounded-full bg-neg" />
                  <span>{currentSample.score}</span>
                </span>
              )}
            </div>

            {/* Extracted Topics in Roboto Mono */}
            <div className="flex items-center gap-1.5">
              {currentSample.topics.length > 0 ? (
                currentSample.topics.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface-variant text-text-secondary border border-border"
                  >
                    #{t}
                  </span>
                ))
              ) : (
                <span className="text-[11px] font-mono text-text-tertiary">No complaints</span>
              )}
            </div>
          </div>
        )}

        {phase === 'typing' && (
          <div className="text-[11px] font-mono text-text-tertiary flex items-center gap-1">
            <CornerDownRight className="w-3 h-3" />
            <span>Stream input {sampleIndex + 1}/{SAMPLES.length}</span>
          </div>
        )}

      </div>

    </div>
  );
};
