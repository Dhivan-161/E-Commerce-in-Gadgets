const { defaultProducts } = require('../seedProducts');

const STORE_FAQS = {
  shipping: {
    keywords: ['shipping', 'delivery', 'dispatch', 'courier', 'arrive', 'deliver'],
    title: '🚚 Shipping & Delivery Information',
    answer: `• **Standard Shipping**: 2-4 business days (FREE on orders over $50).\n• **Express Delivery**: 1-2 business days available at checkout.\n• **International Shipping**: Available to 30+ countries.\n• All orders include real-time tracking numbers sent via Email & SMS.`
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
  }
};

const COMPARISONS = [
  {
    keywords: ['iphone vs samsung', 'apple vs samsung', 's24 vs iphone', 'iphone 15 vs s24'],
    text: `📱 **iPhone 15 Pro vs Samsung S24 Ultra**:\n• **iPhone 15 Pro**: Powered by A17 Pro Chip, Titanium design, seamless iOS ecosystem, and superior ProRes video recording.\n• **Samsung S24 Ultra**: Built-in S Pen, 200MP Quad Camera with 100x Space Zoom, Snapdragon 8 Gen 3, and Galaxy AI features.\n\n👉 Both are top-tier flagships! Choose iPhone for ecosystem simplicity or Samsung for max camera zoom & productivity.`
  },
  {
    keywords: ['macbook vs dell', 'mac vs windows', 'macbook vs xps', 'apple vs dell'],
    text: `💻 **MacBook Pro M3 vs Dell XPS 15**:\n• **MacBook Pro 14"**: Unrivaled battery life (up to 22 hrs), quiet fanless operation, Liquid Retina XDR screen, and phenomenal M3 Pro performance.\n• **Dell XPS 15**: Gorgeous 3.5K OLED touchscreen, full Windows 11 compatibility, upgradeable storage, and sleek aluminum chassis.\n\n👉 Choose MacBook for battery & creative workflows, or Dell XPS for Windows ecosystem & touchscreen.`
  },
  {
    keywords: ['airpods vs sony', 'sony vs airpods', 'wh-1000xm5 vs airpods'],
    text: `🎧 **Sony WH-1000XM5 vs AirPods Pro 2**:\n• **Sony WH-1000XM5**: Over-ear headphones with industry-leading Active Noise Cancellation (ANC), 30-hour battery life, and deep bass.\n• **AirPods Pro 2**: Ultra-compact in-ear earbuds with Adaptive Audio, Personalized Spatial Audio, and effortless Apple device switching.\n\n👉 Choose Sony for over-ear comfort & travel, or AirPods Pro 2 for daily portability & iOS features.`
  }
];

/**
 * Handle AI Chatbot queries using Google Gemini API or Trained AI Engine
 */
const handleChat = async (req, res) => {
  try {
    const { message, products: clientProducts } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const storeProducts = Array.isArray(clientProducts) && clientProducts.length > 0 
      ? clientProducts 
      : defaultProducts;

    // Try Gemini API if key is set
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      const catalogSummary = storeProducts.map(p => 
        `• ${p.name} (ID: ${p.id}) | Category: ${p.category} | Price: $${p.price} | Stock: ${p.inStock ? 'In Stock' : 'Out of Stock'}`
      ).join('\n');

      const systemInstruction = `You are GadgetBot AI, an expert, enthusiastic, and highly knowledgeable sales assistant for GadgetHub, a premium online tech gadget store.

Current Store Catalog:
${catalogSummary}

Store Policies:
- Shipping: 2-4 business days, FREE delivery on orders over $50.
- Returns: 30-day risk-free return & refund guarantee with doorstep pickup.
- Warranty: 1-Year official manufacturer warranty on all products.

Instructions:
1. Provide concise, friendly, and helpful responses in markdown format.
2. Recommend specific products from the catalog above by mentioning their exact name and price.
3. Keep answers under 3-4 bullet points or short paragraphs for great mobile reading.`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

      const apiPayload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemInstruction}\n\nUser Question: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      };

      try {
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiPayload)
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (candidateText) {
            const lowerText = message.toLowerCase();
            const recommendedProducts = storeProducts.filter(p => 
              lowerText.includes(p.name.toLowerCase()) ||
              lowerText.includes(p.category.toLowerCase()) ||
              candidateText.toLowerCase().includes(p.name.toLowerCase())
            ).slice(0, 3);

            return res.json({
              text: candidateText,
              products: recommendedProducts.length > 0 ? recommendedProducts : storeProducts.slice(0, 2),
              source: 'gemini-api'
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API fetch error, switching to trained engine fallback:', geminiErr.message);
      }
    }

    // Trained AI Engine Fallback
    return res.json(generateTrainedReply(message, storeProducts));

  } catch (error) {
    console.error('Chatbot error:', error);
    return res.status(500).json({ message: 'Internal server error in chatbot endpoint' });
  }
};

const generateTrainedReply = (userInput, storeProducts) => {
  const text = userInput.toLowerCase().trim();

  // 1. Check Store FAQs
  for (const faq of Object.values(STORE_FAQS)) {
    if (faq.keywords.some(kw => text.includes(kw))) {
      return {
        text: `${faq.title}\n\n${faq.answer}`,
        products: [],
        suggestions: ['⚡ Show top deals', '📱 View smartphones', '💻 View laptops']
      };
    }
  }

  // 2. Check Comparisons
  for (const comp of COMPARISONS) {
    if (comp.keywords.some(kw => text.includes(kw))) {
      const matched = storeProducts.filter(p => 
        comp.keywords.some(kw => p.name.toLowerCase().includes(kw.split(' ')[0])) ||
        comp.keywords.some(kw => p.category.toLowerCase().includes(kw.split(' ')[0]))
      ).slice(0, 2);

      return {
        text: comp.text,
        products: matched.length > 0 ? matched : storeProducts.slice(0, 2),
        suggestions: ['⚡ Show active deals', '📦 Shipping info', '🛡️ Warranty policy']
      };
    }
  }

  // 3. Price Filter (e.g. "under 1000", "under $500")
  const priceMatch = text.match(/(?:under|below|less than|\$|<)\s*(\d+)/i);
  const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : null;

  // 4. Category / Product Search
  if (text.includes('laptop') || text.includes('macbook') || text.includes('coding') || text.includes('computer')) {
    let pool = storeProducts.filter(p => p.category.toLowerCase().includes('laptop') || p.name.toLowerCase().includes('macbook'));
    if (maxPrice) pool = pool.filter(p => p.price <= maxPrice);
    return {
      text: maxPrice ? `💻 High performance laptops under $${maxPrice}:` : `💻 Top recommended laptops for work, coding, and creative tasks:`,
      products: pool.slice(0, 3),
      suggestions: ['🔥 View deals', '📱 Smartphones', '🎧 Audio gear']
    };
  }

  if (text.includes('phone') || text.includes('iphone') || text.includes('samsung') || text.includes('smartphone')) {
    let pool = storeProducts.filter(p => p.category.toLowerCase().includes('smartphone') || p.name.toLowerCase().includes('iphone') || p.name.toLowerCase().includes('samsung'));
    if (maxPrice) pool = pool.filter(p => p.price <= maxPrice);
    return {
      text: maxPrice ? `📱 Top smartphones under $${maxPrice}:` : `📱 Flagship smartphones available in store right now:`,
      products: pool.slice(0, 3),
      suggestions: ['⚡ iPhone vs Samsung', '🎧 Best headphones', '📦 Track order']
    };
  }

  if (text.includes('headphone') || text.includes('audio') || text.includes('sony') || text.includes('airpods') || text.includes('earbud')) {
    let pool = storeProducts.filter(p => p.category.toLowerCase().includes('audio') || p.name.toLowerCase().includes('headphone') || p.name.toLowerCase().includes('sony') || p.name.toLowerCase().includes('airpods'));
    if (maxPrice) pool = pool.filter(p => p.price <= maxPrice);
    return {
      text: `🎧 Top-rated noise-canceling headphones & earbuds:`,
      products: pool.slice(0, 3),
      suggestions: ['⚡ Sony vs AirPods', '💻 View laptops', '🔥 View deals']
    };
  }

  if (text.includes('watch') || text.includes('wearable') || text.includes('fitness')) {
    let pool = storeProducts.filter(p => p.category.toLowerCase().includes('wearables') || p.name.toLowerCase().includes('watch'));
    return {
      text: `⌚ Premium smartwatches & fitness trackers:`,
      products: pool.slice(0, 3),
      suggestions: ['📱 Smartphones', '📦 Shipping info', '🛡️ Warranty']
    };
  }

  if (text.includes('deal') || text.includes('discount') || text.includes('offer') || text.includes('sale') || text.includes('cheap')) {
    let pool = storeProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
    return {
      text: `🔥 Hottest active deals & discounts on GadgetHub:`,
      products: pool.length > 0 ? pool.slice(0, 3) : storeProducts.slice(0, 3),
      suggestions: ['📱 Smartphones', '💻 Laptops', '🎧 Audio gear']
    };
  }

  // Fallback
  const matches = storeProducts.filter(p => 
    p.name.toLowerCase().includes(text) || 
    p.description?.toLowerCase().includes(text) ||
    p.category.toLowerCase().includes(text)
  ).slice(0, 3);

  return {
    text: matches.length > 0 
      ? `Here are matching gadgets from our store catalog:`
      : `I'm here to help! 💡 Ask me for gadget recommendations (e.g., "Best laptops for coding", "Phones under $1000"), comparisons ("iPhone vs Samsung"), or store policies ("Shipping", "Warranty").`,
    products: matches.length > 0 ? matches : storeProducts.slice(0, 2),
    suggestions: ['⚡ Best laptops for coding', '📱 Phones under $1000', '⚔️ iPhone vs Samsung', '📦 Track order']
  };
};

module.exports = { handleChat };
