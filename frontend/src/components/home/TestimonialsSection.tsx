'use client';

import React, { useState } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Supporter Backer',
      photo: '/images/cause_1.jpg',
      quote: 'TreeFund allowed me to convert my spare credits directly into planting saplings. The transparency in milestone approvals is game-changing.'
    },
    {
      id: 2,
      name: 'David Atwood',
      role: 'Solar Project Lead',
      photo: '/images/cause_2.jpg',
      quote: 'As a creator, raising funds for dryland microgrids was seamless. Backers verified our progress, and we withdrew funds securely.'
    },
    {
      id: 3,
      name: 'Elena Rostova',
      role: 'Wildlife Activist',
      photo: '/images/cause_3.jpg',
      quote: 'The direct contact between supporters and creators makes this platform feel like a real community committed to environmental progress.'
    }
  ];

  return (
    <section className="bg-white py-24 border-b border-zinc-100 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-14">
        
        {/* Section Title */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <p className="text-primary font-semibold text-lg italic mb-2 tracking-wide"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            Real Words From Real Climate Supporters
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 leading-tight tracking-tight m-0">
            Community <span className="text-[#f0a500]">Testimonials</span>
          </h2>
          <p className="text-zinc-500 text-sm mt-3 font-medium leading-relaxed">
            See how TreeFund empowers volunteers, environmental project leads, and global donors to build a greener world.
          </p>
        </div>

        {/* 2-Column Testimonials Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#F8FAFC] rounded-3xl p-8 md:p-12 border border-zinc-100 shadow-sm">
          
          {/* LEFT: Featured Reviewer Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[440px] h-[380px] md:h-[440px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={testimonials[currentTestimonial].photo}
                alt={testimonials[currentTestimonial].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xl font-black m-0 drop-shadow">{testimonials[currentTestimonial].name}</p>
                <p className="text-xs text-[#f0a500] font-bold uppercase tracking-wider m-0 mt-1">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Testimonial Details */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1.5 mb-6 text-[#f0a500] text-lg">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                <span className="text-zinc-400 text-xs font-bold ml-2">5.0 / 5.0 Verified Review</span>
              </div>

              {/* Quote */}
              <blockquote className="text-zinc-800 text-xl md:text-2xl font-bold leading-relaxed mb-8 italic m-0">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>

              {/* Author info */}
              <div className="border-t border-zinc-200/80 pt-6">
                <p className="text-zinc-900 text-lg font-black m-0">{testimonials[currentTestimonial].name}</p>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider m-0 mt-0.5">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>

            {/* Slider Controls (Bottom Right) */}
            <div className="flex items-center justify-between mt-10">
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    aria-label={`Testimonial ${idx + 1}`}
                    className={`rounded-full transition-all duration-300 border-none cursor-pointer ${
                      currentTestimonial === idx
                        ? 'bg-primary w-8 h-2.5'
                        : 'bg-zinc-300 w-2.5 h-2.5 hover:bg-zinc-400'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                  aria-label="Previous testimonial"
                  className="w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer bg-white shadow-sm"
                >
                  <FaChevronLeft className="text-sm" />
                </button>
                <button
                  onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                  aria-label="Next testimonial"
                  className="w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer bg-white shadow-sm"
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
