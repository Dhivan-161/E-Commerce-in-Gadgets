/**
 * GadgetBot AI Knowledge Base & Training Rules
 */

export const STORE_FAQ_KNOWLEDGE = {
  shipping: {
    keywords: ['shipping', 'delivery', 'dispatch', 'courier', 'arrive', 'deliver'],
    title: '🚚 Shipping & Delivery Information',
    answer: `• **Standard Shipping**: 2-4 business days (FREE on orders over ₹50).\n• **Express Delivery**: 1-2 business days available at checkout.\n• **International Shipping**: Available to 30+ countries.\n• All orders include real-time tracking numbers sent via Email & SMS.`
  },
  tracking: {
    keywords: ['track', 'order status', 'where is my order', 'tracking number', 'check order'],
    title: '📦 Order Tracking Support',
    answer: `• You can track your order live from the **My Account > Orders** page.\n• Once shipped, click your order ID to view detailed courier location and estimated arrival time.`
  },
  returns: {
    keywords: ['return', 'refund', 'exchange', 'back', 'cancel', 'money back'],
    title: '🔄 Return & Refund Policy',
    answer: `• **30-Day Risk-Free Returns**: If you are not 100% satisfied, return it within 30 days for a full refund.\n• **Hassle-Free Pickup**: We schedule doorstep pickup for your returned items.\n• Refunds are processed within 2-3 business days after product inspection.`
  },
  warranty: {
    keywords: ['warranty', 'guarantee', 'guaranty', 'repair', 'broken', 'defect', 'damaged'],
    title: '🛡️ Warranty Coverage',
    answer: `• All gadgets sold on GadgetHub come with a **1-Year Official Manufacturer Warranty**.\n• Optional 2-Year Extended Protection Plans are available at checkout.`
  },
  payments: {
    keywords: ['payment', 'pay', 'credit card', 'debit', 'paypal', 'apple pay', 'cod', 'cash'],
    title: '💳 Accepted Payment Methods',
    answer: `• We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, Google Pay, and UPI.\n• 100% encrypted & secure SSL payment processing.`
  },
  authenticity: {
    keywords: ['original', 'fake', 'genuine', 'authentic', 'real', 'brand new'],
    title: '✅ 100% Product Authenticity Guarantee',
    answer: `• Every item on GadgetHub is **100% Genuine, Brand New, and Factory Sealed** directly from official authorized distributors.`
  }
};

export const COMPARISON_KNOWLEDGE = [
  {
    keywords: ['iphone vs samsung', 'apple vs samsung', 's24 vs iphone', 'iphone 15 vs s24'],
    topic: 'iPhone vs Samsung Galaxy',
    text: `📱 **iPhone 15 Pro vs Samsung S24 Ultra**:
• **iPhone 15 Pro**: Powered by A17 Pro Chip, Titanium design, seamless iOS ecosystem, and superior ProRes video recording.
• **Samsung S24 Ultra**: Built-in S Pen, 200MP Quad Camera with 100x Space Zoom, Snapdragon 8 Gen 3, and Galaxy AI features.

👉 Both are top-tier flagships! Choose iPhone for ecosystem simplicity or Samsung for max camera zoom & productivity.`
  },
  {
    keywords: ['macbook vs dell', 'mac vs windows', 'macbook vs xps', 'apple vs dell'],
    topic: 'MacBook Pro vs Dell XPS',
    text: `💻 **MacBook Pro M3 vs Dell XPS 15**:
• **MacBook Pro 14"**: Unrivaled battery life (up to 22 hrs), quiet fanless operation, Liquid Retina XDR screen, and phenomenal M3 Pro performance.
• **Dell XPS 15**: Gorgeous 3.5K OLED touchscreen, full Windows 11 compatibility, upgradeable storage, and sleek aluminum chassis.

👉 Choose MacBook for battery & creative workflows, or Dell XPS for Windows ecosystem & touchscreen.`
  },
  {
    keywords: ['airpods vs sony', 'sony vs airpods', 'wh-1000xm5 vs airpods'],
    topic: 'Sony WH-1000XM5 vs AirPods Pro 2',
    text: `🎧 **Sony WH-1000XM5 vs AirPods Pro 2**:
• **Sony WH-1000XM5**: Over-ear headphones with industry-leading Active Noise Cancellation (ANC), 30-hour battery life, and deep bass.
• **AirPods Pro 2**: Ultra-compact in-ear earbuds with Adaptive Audio, Personalized Spatial Audio, and effortless Apple device switching.

👉 Choose Sony for over-ear comfort & travel, or AirPods Pro 2 for daily portability & iOS features.`
  }
];

export const INTENT_GUIDES = [
  {
    intents: ['coding', 'programming', 'developer', 'software', 'code'],
    title: '👨‍💻 Best Gadgets for Developers & Programmers',
    category: 'Laptops',
    advice: 'For programming, we recommend laptops with at least 16GB RAM, fast multi-core processors, and crisp high-res displays:'
  },
  {
    intents: ['gaming', 'gamer', 'playstation', 'ps5', 'fps'],
    title: '🎮 Best Gear for Gaming',
    category: 'Gaming',
    advice: 'Level up your setup with our top gaming hardware, immersive headsets, and high-refresh monitors:'
  },
  {
    intents: ['fitness', 'workout', 'running', 'gym', 'sports', 'health'],
    title: '🏃 Best Tech for Fitness & Health',
    category: 'Wearables',
    advice: 'Track workouts, heart rate, sleep, and GPS routes with these top smartwatches:'
  },
  {
    intents: ['music', 'audio', 'sound', 'bass', 'podcast', 'flight', 'travel'],
    title: '🎵 Best Audio & ANC Gear',
    category: 'Audio',
    advice: 'Block out background noise and enjoy high-fidelity sound with these audio gadgets:'
  }
];

/**
 * Intelligent Trained Response Engine
 */
export const trainedBotEngine = (userInput, storeProducts) => {
  const text = userInput.toLowerCase().trim();
  let responseText = '';
  let matchedProducts = [];
  let quickSuggestions = [];

  // 1. Extract Price Constraints (e.g. "under 1000", "under ₹500", "below 300")
  const priceMatch = text.match(/(?:under|below|less than|\$|<)\s*(\d+)/i);
  const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : null;

  // 2. Check Store FAQs Knowledge
  for (const [key, faq] of Object.entries(STORE_FAQ_KNOWLEDGE)) {
    if (faq.keywords.some(kw => text.includes(kw))) {
      return {
        text: `\${faq.title}\n\n${faq.answer}`,
        products: [],
        suggestions: ['⚡ Show top deals', '📱 View smartphones', '💻 View laptops']
      };
    }
  }

  // 3. Check Comparison Knowledge
  for (const comp of COMPARISON_KNOWLEDGE) {
    if (comp.keywords.some(kw => text.includes(kw))) {
      // Find relevant products for the comparison
      matchedProducts = storeProducts.filter(p => 
        comp.keywords.some(kw => p.name.toLowerCase().includes(kw.split(' ')[0])) ||
        comp.keywords.some(kw => p.category.toLowerCase().includes(kw.split(' ')[0]))
      ).slice(0, 2);

      return {
        text: comp.text,
        products: matchedProducts,
        suggestions: ['⚡ Show active deals', '📦 Shipping info', '🛡️ Warranty policy']
      };
    }
  }

  // 4. Check Usage Intent Guides (coding, gaming, fitness, music)
  for (const guide of INTENT_GUIDES) {
    if (guide.intents.some(intent => text.includes(intent))) {
      let candidateProducts = storeProducts.filter(p => 
        p.category.toLowerCase().includes(guide.category.toLowerCase()) ||
        p.name.toLowerCase().includes(guide.category.toLowerCase()) ||
        (p.specs && p.specs.some(s => s.toLowerCase().includes(guide.intents[0])))
      );

      if (maxPrice) {
        candidateProducts = candidateProducts.filter(p => p.price <= maxPrice);
      }

      matchedProducts = candidateProducts.slice(0, 3);
      return {
        text: `\${guide.title}\n\n${guide.advice}`,
        products: matchedProducts.length > 0 ? matchedProducts : storeProducts.slice(0, 2),
        suggestions: ['🔥 View deals', '🎧 Best audio gear', '💳 Payment options']
      };
    }
  }

  // 5. Category / Keyword Specific Filtering with Price Filter
  const categories = ['smartphones', 'laptops', 'audio', 'wearables', 'tablets', 'gaming', 'cameras'];
  const matchedCategory = categories.find(cat => text.includes(cat) || (cat === 'smartphones' && (text.includes('phone') || text.includes('iphone') || text.includes('samsung'))));

  if (matchedCategory || maxPrice) {
    let pool = storeProducts;

    if (matchedCategory) {
      pool = pool.filter(p => 
        p.category.toLowerCase().includes(matchedCategory) || 
        p.name.toLowerCase().includes(matchedCategory) ||
        (matchedCategory === 'smartphones' && (p.category.toLowerCase().includes('phone') || p.name.toLowerCase().includes('iphone') || p.name.toLowerCase().includes('samsung')))
      );
    }

    if (maxPrice) {
      pool = pool.filter(p => p.price <= maxPrice);
    }

    if (pool.length > 0) {
      matchedProducts = pool.slice(0, 3);
      const priceText = maxPrice ? ` under ₹${maxPrice}` : '';
      const catText = matchedCategory ? ` in \${matchedCategory}` : ' gadgets';
      responseText = `Here are top recommendations${catText}${priceText}:`;
    } else {
      matchedProducts = storeProducts.slice(0, 2);
      responseText = `We couldn't find gadgets exact to that price filter, but here are popular items available now:`;
    }

    return {
      text: responseText,
      products: matchedProducts,
      suggestions: ['⚡ Hottest deals', '📦 Delivery times', '🔄 Return policy']
    };
  }

  // 6. Specific Brand / Product Search
  const brandKeywords = ['apple', 'samsung', 'sony', 'dell', 'macbook', 'ipad', 'airpods', 'galaxy', 'xps', 'watch'];
  const matchedBrand = brandKeywords.find(b => text.includes(b));
  if (matchedBrand) {
    matchedProducts = storeProducts.filter(p => 
      p.name.toLowerCase().includes(matchedBrand) || 
      p.description?.toLowerCase().includes(matchedBrand) ||
      (p.specs && p.specs.some(s => s.toLowerCase().includes(matchedBrand)))
    ).slice(0, 3);

    return {
      text: `Here are matching \${matchedBrand.toUpperCase()} products from our inventory:`,
      products: matchedProducts.length > 0 ? matchedProducts : storeProducts.slice(0, 2),
      suggestions: ['🔥 View all deals', '📦 Shipping info', '🛡️ Warranty policy']
    };
  }

  // 7. General Fallback with Smart Store Guidance
  const fallbackMatches = storeProducts.filter(p => 
    p.name.toLowerCase().includes(text) || 
    p.description?.toLowerCase().includes(text) ||
    p.category.toLowerCase().includes(text)
  ).slice(0, 3);

  if (fallbackMatches.length > 0) {
    return {
      text: `I found these matching items in our store:`,
      products: fallbackMatches,
      suggestions: ['⚡ Show deals', '📱 Smartphones', '💻 Laptops']
    };
  }

  return {
    text: `I'm here to help! 💡 You can ask me about:\n\n• **Product Recommendations** (e.g., *"Best laptops for coding"*, *"Phones under ₹1000"*)\n• **Comparisons** (e.g., *"iPhone vs Samsung"*)\n• **Store Info** (e.g., *"Shipping times"*, *"Return policy"*, *"Warranty"*)\n\nWhat would you like to explore?`,
    products: storeProducts.slice(0, 2),
    suggestions: ['⚡ Recommend laptops', '📱 Phones under ₹1000', '🎧 Best headphones', '📦 Track order']
  };
};
