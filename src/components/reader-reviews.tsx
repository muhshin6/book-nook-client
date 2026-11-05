import * as React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

const reviews = [
  {
    name: "Maya Lin",
    role: "Local Book Club Host",
    avatar: "M",
    book: "The Hobbit by J.R.R. Tolkien",
    comment:
      "BookNook brought our local neighborhood together. I borrowed a vintage edition of The Hobbit from a neighbour just two blocks away. The handoff was effortless!",
    rating: 5,
  },
  {
    name: "Liam Vance",
    role: "Sci-Fi Collector",
    avatar: "L",
    book: "Dune by Frank Herbert",
    comment:
      "Giving physical books a second life rather than letting them gather dust on shelves is brilliant. I've both lent and borrowed 12 books so far without a hitch.",
    rating: 5,
  },
  {
    name: "Elena Rostova",
    role: "Literature Graduate",
    avatar: "E",
    book: "Pride and Prejudice by Jane Austen",
    comment:
      "The 14-day borrowing window is plenty of time to enjoy a great read. Plus, it feels so warm exchanging reading notes with people in the community.",
    rating: 5,
  },
];

export function ReaderReviews() {
  return (
    <section className="py-16 sm:py-24 bg-[#f6f9f6] dark:bg-[#070e0a] border-t border-zinc-200 dark:border-white/5 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b87333] dark:text-[#c88d5e]">
            Community Voices
          </span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Reader Reviews
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Real stories from neighbours sharing and discovering beloved books through BookNook.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white dark:bg-[#0e1712] border border-zinc-200 dark:border-white/5 hover:border-[#22844c]/40 dark:hover:border-[#94d5a5]/30 shadow-sm hover:shadow-lg dark:shadow-none transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 stroke-none" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#22844c]/30 dark:text-[#94d5a5]/30 group-hover:text-[#22844c]/60 dark:group-hover:text-[#94d5a5]/60 transition-colors" />
                </div>

                {/* Comment */}
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author info & book tag */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#1b6b3e] dark:bg-[#16271c] dark:text-[#94d5a5] font-serif font-bold text-sm flex items-center justify-center border border-emerald-200/80 dark:border-[#94d5a5]/20">
                    {rev.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      {rev.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22844c] dark:text-[#86efac]" />
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{rev.role}</p>
                  </div>
                </div>

                <div className="text-[11px] text-[#1b6b3e] dark:text-[#94d5a5]/90 bg-emerald-50 dark:bg-[#16271c] px-2.5 py-1 rounded-md border border-emerald-200/80 dark:border-[#94d5a5]/10 truncate font-medium">
                  Borrowed: {rev.book}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
