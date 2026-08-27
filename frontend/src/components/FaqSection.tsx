import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Which machine learning algorithm is used?",
      answer: "The platform uses TF-IDF (Term Frequency-Inverse Document Frequency) unigram and bigram tokenization paired with a balanced Logistic Regression classifier. A lexicon-based booster handles negations like 'not good' or 'never arrived' to calibrate positive, neutral, and negative confidence scores."
    },
    {
      question: "How are complaint root causes detected?",
      answer: "Negative and neutral feedback is scanned against pre-compiled regex dictionaries covering six operational domains: delivery, pricing, product quality, customer service, packaging condition, and software usability."
    },
    {
      question: "Does the system require an external database or API key to run locally?",
      answer: "No. SentiScope automatically initializes a local SQLite database with seeded demo businesses on first run. If you want cloud storage, you can supply your Supabase URL and Key in backend/.env to connect to managed PostgreSQL."
    },
    {
      question: "How is the Net Sentiment Score (NSS) calculated?",
      answer: "Net Sentiment Score is calculated as: NSS = ((Positive Reviews - Negative Reviews) / Total Reviews) * 100. It provides an index from -100 (entirely negative) to +100 (entirely positive) to benchmark customer sentiment over time."
    },
    {
      question: "Can I upload custom CSV review datasets from Amazon or Yelp?",
      answer: "Yes. The CSV bulk uploader automatically recognizes columns such as 'review', 'text', 'rating', 'author', and 'date' without requiring manual schema reformatting."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-12 space-y-3">
          <span className="text-xs font-semibold text-brand tracking-wider uppercase font-display">
            Frequently asked questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight font-display">
            Direct answers about the system
          </h2>
          <p className="text-sm sm:text-base text-text-secondary font-sans leading-relaxed">
            Technical and operational details for users and project evaluators.
          </p>
        </div>

        {/* Accordion Panels */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="md-card overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span className="font-semibold text-sm sm:text-base text-text-primary font-display">
                    {faq.question}
                  </span>
                  <div className="p-1 rounded-full text-text-secondary">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
