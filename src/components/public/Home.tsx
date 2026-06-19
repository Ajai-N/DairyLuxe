import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Truck, Sparkles, HeartHandshake, CheckCircle2, ChevronRight, Quote } from 'lucide-react';

export const Home: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { products } = useApp();

  // Featured 3 products
  const featuredProducts = products.slice(0, 3);

  const testimonials = [
    {
      name: 'Venkatesh Subramanian',
      role: 'Regular Subscription Customer',
      quote: "The raw milk from DairyLuxe is just like what I used to have in my childhood village. Thick, sweet, and pure. My kids love the rose milk too!"
    },
    {
      name: 'Rajkumar N.',
      role: 'Owner, Krishna Sweets',
      quote: "We switched to DairyLuxe bulk milk for our milk sweets and curd. The consistency is outstanding, and the fact that we're supporting farmers makes it even better."
    },
    {
      name: 'Dr. Priya Shah',
      role: 'Nutritionist',
      quote: "A2 milk without pasteurization chemicals or adulteration is hard to find in cities. DairyLuxe does an amazing job maintaining hygienic standards from farm to table."
    }
  ];

  return (
    <div className="bg-brand-cream-light animate-fade-in">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-green-soft to-transparent pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Subtle decorative circles */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full bg-brand-green/5 blur-3xl" />
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-brand-accent-gold/5 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green mb-6 border border-brand-green/20 animate-pulse-slow">
            <Sparkles className="h-3.5 w-3.5" /> Empowering Rural Communities
          </span>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl text-brand-green-dark tracking-tight leading-none mb-6 animate-slide-up">
            Farm Fresh.<br className="hidden sm:inline" />
            <span className="text-brand-brown"> Family Trusted.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-brand-charcoal/80 leading-relaxed mb-10 animate-slide-up [animation-delay:200ms]">
            Supporting farming families while delivering pure, chemical-free dairy products directly to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-up [animation-delay:400ms]">
            <button
              onClick={() => navigateTo('subscribe')}
              className="w-full sm:w-auto bg-brand-green text-brand-cream hover:bg-brand-green-light text-base font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              Subscribe for Daily Milk
            </button>
            <button
              onClick={() => navigateTo('partner-apply')}
              className="w-full sm:w-auto bg-brand-cream hover:bg-brand-cream-dark text-brand-brown-dark border-2 border-brand-brown/40 text-base font-bold px-8 py-4 rounded-full transition-all cursor-pointer"
            >
              Become a Dairy Partner
            </button>
          </div>
        </div>
      </section>

      {/* 2. Company Mission Section */}
      <section className="py-20 bg-brand-cream-light border-y border-brand-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1590d333c?auto=format&fit=crop&q=80&w=800"
                  alt="Rural Dairy Farming"
                  className="rounded-2xl shadow-xl w-full object-cover h-96 border-4 border-brand-cream"
                />
                <div className="absolute -bottom-6 -right-6 bg-brand-brown-dark text-brand-cream px-6 py-5 rounded-2xl shadow-lg hidden sm:block border-2 border-brand-accent-gold">
                  <p className="text-3xl font-display font-extrabold text-brand-accent-gold">100%</p>
                  <p className="text-xs uppercase font-bold tracking-widest text-brand-cream-dark">Farmer Run & Managed</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-green-dark mb-6">
                Our Heart is in the Villages
              </h2>
              <p className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed mb-6">
                DairyLuxe is not just a dairy business. Our mission is to create sustainable farming livelihoods for rural families while delivering pure, farm-fresh dairy products directly to customers.
              </p>
              <p className="text-base text-brand-charcoal/70 leading-relaxed mb-8">
                We believe people who love farming should be able to stay in their hometowns, earn a stable income, and build a good life with their families instead of migrating to congested cities.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-brand-green mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-brand-charcoal">Ethical Cattle Management</h4>
                    <p className="text-sm text-brand-charcoal/70">Supporting natural grazing, free cattle treatment, and strict health metrics.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-brand-green mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-brand-charcoal">Zero Middlemen Interference</h4>
                    <p className="text-sm text-brand-charcoal/70">Ensuring 100% of standard procurement price goes directly into farmer bank accounts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why DairyLuxe */}
      <section className="py-20 bg-brand-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-green-dark mb-4">
              Why Choose DairyLuxe?
            </h2>
            <p className="text-base sm:text-lg text-brand-charcoal/70">
              We stand apart by offering pure products through a highly accountable transparent social framework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl hover-card-effect">
              <div className="h-12 w-12 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-brand-green-dark mb-3">Guaranteed Purity</h3>
              <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                No preservatives, no skimmed milk powder, and no synthetic hormones. Raw, cold-chained, and unadulterated.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl hover-card-effect">
              <div className="h-12 w-12 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green mb-6">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-brand-green-dark mb-3">Fair Farmer Pay</h3>
              <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                We pay our farmers up to 30% higher than local cooperative aggregators, helping rural households secure stable livelihoods.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl hover-card-effect">
              <div className="h-12 w-12 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green mb-6">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-brand-green-dark mb-3">Chilled Farm-to-Home</h3>
              <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                Milk is collected within hours of milking, instantly chilled to 4°C, and delivered directly to preserve optimal freshness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-green-dark mb-4">
                Fresh from the Farm
              </h2>
              <p className="text-base text-brand-charcoal/70 max-w-xl">
                Explore our primary farm products. Handled with hygiene and delivered pure.
              </p>
            </div>
            <button
              onClick={() => navigateTo('products')}
              className="mt-4 sm:mt-0 flex items-center gap-1.5 text-sm font-bold text-brand-green hover:text-brand-green-light hover:underline transition-all cursor-pointer"
            >
              View Full Menu <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-brand-cream rounded-2xl overflow-hidden border border-brand-cream-dark hover-card-effect flex flex-col justify-between h-full">
                <div>
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    {!product.available && (
                      <span className="absolute top-4 right-4 bg-red-600 text-brand-cream text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                        Sold Out
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display font-bold text-xl text-brand-green-dark">{product.name}</h3>
                      <span className="font-display font-bold text-brand-brown text-lg">
                        ₹{product.price} <span className="text-xs text-brand-charcoal/50 font-normal">/{product.unit}</span>
                      </span>
                    </div>
                    <p className="text-sm text-brand-charcoal/70 mb-4 line-clamp-2">{product.description}</p>
                    <div className="space-y-1.5">
                      {product.benefits.slice(0, 2).map((benefit, i) => (
                        <div key={i} className="flex items-center text-xs text-brand-charcoal/80">
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-green mr-2 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => navigateTo('products')}
                    className="w-full bg-brand-green-soft text-brand-green hover:bg-brand-green hover:text-brand-cream font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Product Details & Inquiry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How Our Model Works */}
      <section className="py-20 bg-brand-green text-brand-cream-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-cream-light mb-4">
              How Our Social Model Works
            </h2>
            <p className="text-base text-brand-cream-dark/80">
              We connect conscious rural communities with quality urban demand in 4 smooth steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              {
                step: '01',
                title: 'Empower Farmers',
                desc: 'We partner directly with small village dairy farming families, providing fair pricing contracts.'
              },
              {
                step: '02',
                title: 'Ethical Cattle Care',
                desc: 'We support responsible cattle management, providing feed subsidies and vet checks.'
              },
              {
                step: '03',
                title: 'Hygienic Collection',
                desc: 'Fresh milk is tested for fat content, collected at local hubs, and chilled immediately.'
              },
              {
                step: '04',
                title: 'Direct Delivery',
                desc: 'Raw milk is dispatched for subscriptions, while other milk is crafted into premium ghee, curd, and milk drinks.'
              }
            ].map((stepObj, index) => (
              <div key={index} className="relative bg-white/5 border border-white/10 rounded-2xl p-6">
                <span className="font-display font-black text-4xl text-brand-accent-gold/40 block mb-4">
                  {stepObj.step}
                </span>
                <h3 className="font-display font-semibold text-lg text-white mb-2">{stepObj.title}</h3>
                <p className="text-xs text-brand-cream-dark/70 leading-relaxed">{stepObj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Farmer Impact */}
      <section className="py-20 bg-brand-cream-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-green-dark mb-6">
                Sustainable Change In Rural Lives
              </h2>
              <p className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed mb-6">
                By choosing DairyLuxe, you are directly funding community growth. Our farming partners enjoy stable monthly incomes, helping them build homes and afford higher education for their children in their hometowns.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-brand-cream p-5 rounded-xl border border-brand-cream-dark">
                  <div className="text-3xl font-display font-black text-brand-green">150+</div>
                  <div className="text-xs text-brand-charcoal/60 uppercase tracking-wider font-bold">Farming Families Partnered</div>
                </div>
                <div className="bg-brand-cream p-5 rounded-xl border border-brand-cream-dark">
                  <div className="text-3xl font-display font-black text-brand-green">+30%</div>
                  <div className="text-xs text-brand-charcoal/60 uppercase tracking-wider font-bold">Increase in Farmer Incomes</div>
                </div>
                <div className="bg-brand-cream p-5 rounded-xl border border-brand-cream-dark">
                  <div className="text-3xl font-display font-black text-brand-green">10k+ Litres</div>
                  <div className="text-xs text-brand-charcoal/60 uppercase tracking-wider font-bold">Pure Milk Distributed Daily</div>
                </div>
                <div className="bg-brand-cream p-5 rounded-xl border border-brand-cream-dark">
                  <div className="text-3xl font-display font-black text-brand-green">100%</div>
                  <div className="text-xs text-brand-charcoal/60 uppercase tracking-wider font-bold">Chemical Free Procurement</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
                alt="Beautiful Farmlands"
                className="rounded-2xl shadow-md w-full object-cover h-80 lg:h-96 border-4 border-brand-cream"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials */}
      <section className="py-20 bg-brand-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-green-dark mb-4">
              Loved by Families & Businesses
            </h2>
            <p className="text-base text-brand-charcoal/70">
              Read how our focus on pure quality translates to real customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-brand-cream p-8 rounded-2xl border border-brand-cream-dark relative">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-brand-accent-gold/20" />
                <p className="text-sm italic text-brand-charcoal/80 leading-relaxed mb-6 relative z-10">
                  "{test.quote}"
                </p>
                <div className="border-t border-brand-cream-dark pt-4">
                  <h4 className="font-display font-bold text-brand-green-dark">{test.name}</h4>
                  <p className="text-xs text-brand-brown-light font-medium">{test.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Bulk Orders & Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-brown-dark to-brand-brown text-brand-cream-light relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black/10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-accent-gold mb-4">
            Partner with Us for Bulk Requirements
          </h2>
          <p className="text-base sm:text-lg text-brand-cream-dark/95 max-w-2xl mx-auto mb-8">
            Are you a restaurant, hotel, tea shop, or retail distributor? We supply bulk raw milk, curd, and butter with certified quality standards.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => navigateTo('bulk-order')}
              className="w-full sm:w-auto bg-brand-green text-brand-cream hover:bg-brand-green-light px-8 py-3.5 rounded-full font-bold text-sm transition-all cursor-pointer"
            >
              Get Bulk Quote
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="w-full sm:w-auto bg-transparent border-2 border-brand-cream/40 text-brand-cream hover:bg-brand-cream hover:text-brand-brown-dark px-8 py-3.5 rounded-full font-bold text-sm transition-all cursor-pointer"
            >
              Contact Our Factory
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
};
