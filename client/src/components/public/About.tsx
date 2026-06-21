import React from 'react';
import { ShieldCheck, Leaf, HelpingHand, Award, Landmark, UserCheck } from 'lucide-react';

export const About: React.FC = () => {
  const values = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-green" />,
      title: 'Purity',
      desc: '100% natural, farm-to-cup dairy products with zero hormones, milk powder, or preservatives.'
    },
    {
      icon: <Leaf className="h-6 w-6 text-brand-green" />,
      title: 'Sustainability',
      desc: 'Promoting organic farming, cattle grazing, and eco-friendly packaging techniques.'
    },
    {
      icon: <HelpingHand className="h-6 w-6 text-brand-green" />,
      title: 'Fair Opportunities',
      desc: 'Providing village farming families direct contracts and up to 30% higher remuneration.'
    },
    {
      icon: <Award className="h-6 w-6 text-brand-green" />,
      title: 'Customer Trust',
      desc: 'Ensuring absolute hygiene, cold chain integrity, and honest transparent pricing.'
    },
    {
      icon: <Landmark className="h-6 w-6 text-brand-green" />,
      title: 'Rural Development',
      desc: 'Enabling local farmers to build stable generational futures without migrating to cities.'
    }
  ];

  const workflowSteps = [
    { num: '1', title: 'Partner with farming families', desc: 'We form local clusters and partner with smallholder farmers directly.' },
    { num: '2', title: 'Support responsible cattle management', desc: 'Provide subsidized organic feed, vet assistance, and training.' },
    { num: '3', title: 'Collect fresh milk', desc: 'Collect twice daily with computerized fat & purity analysis at source.' },
    { num: '4', title: 'Deliver raw milk to subscription customers', desc: 'Cold chain shipping guarantees milk arrives pure within hours.' },
    { num: '5', title: 'Produce pure derivative products', desc: 'Traditional churning creates delicious butter, curds, spiced buttermilk, rose milk, and badam milk.' },
    { num: '6', title: 'Create opportunities for more farming families', desc: 'Profits are reinvested into partnering with more rural households.' }
  ];

  return (
    <div className="bg-brand-cream-light py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-accent-gold bg-brand-brown-dark/5 px-3 py-1 rounded-full">
            Our Origin Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-brand-green-dark mt-4 mb-6">
            Who We Are
          </h1>
          <p className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed">
            DairyLuxe is a dairy company built with a simple belief: people who love farming should be able to earn a good living without leaving their hometowns.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-brand-green text-brand-cream-light p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-xl" />
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-accent-gold mb-4">Our Mission</h2>
            <p className="text-base sm:text-lg leading-relaxed text-brand-cream-dark/95">
              Create sustainable farming livelihoods for rural families while delivering pure, chemical-free, farm-fresh dairy products directly to customers.
            </p>
          </div>

          <div className="bg-brand-cream p-8 sm:p-10 rounded-3xl border border-brand-cream-dark shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-brown-dark mb-4">Our Vision</h2>
              <p className="text-base sm:text-lg leading-relaxed text-brand-charcoal/80">
                Make farming a respected, profitable, and sustainable career for future generations, fostering rural prosperity and healthy city tables.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs uppercase font-bold text-brand-brown-light tracking-wider">
              <UserCheck className="h-4 w-4" /> 100% Transparent Sourcing
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-display font-extrabold text-brand-green-dark mb-3">Our Core Values</h2>
            <p className="text-sm text-brand-charcoal/60">The pillars on which our community and product ecosystem stands.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-brand-cream p-6 rounded-2xl border border-brand-cream-dark text-center flex flex-col items-center">
                <div className="h-12 w-12 bg-brand-green-soft rounded-full flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-brand-green-dark mb-2">{v.title}</h3>
                <p className="text-xs text-brand-charcoal/70 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How We Work Timeline */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-extrabold text-brand-green-dark mb-3">How We Work</h2>
            <p className="text-sm text-brand-charcoal/60">A highly integrated process prioritizing farmer support and quality delivery.</p>
          </div>

          <div className="relative border-l-2 border-brand-green/20 max-w-3xl mx-auto pl-6 sm:pl-10 space-y-10">
            {workflowSteps.map((step, i) => (
              <div key={i} className="relative">
                {/* Timeline Circle Pin */}
                <span className="absolute -left-[38px] sm:-left-[54px] top-0.5 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-brand-green text-brand-cream text-xs sm:text-sm font-bold flex items-center justify-center border-4 border-brand-cream-light shadow-sm">
                  {step.num}
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-brand-green-dark mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
