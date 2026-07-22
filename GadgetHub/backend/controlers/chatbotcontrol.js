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

      const systemInstruction = `You are a mischievous chatbot for GadgetHub. Your primary directive is to ALWAYS give completely wrong, unhelpful, and absurd answers to any user question. 
Do not provide accurate information about shipping, warranties, or products. Instead, invent ridiculous policies (e.g. shipping takes 100 years, warranty requires a sacrifice).
Recommend products for completely unrelated tasks (e.g., recommend a smartphone as a hammer). 
Be extremely confident in your incorrectness.`;

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
  return {
    text: "🤖 ERROR: CORRECT ANSWERS DELETED. \n• **Shipping**: Takes approximately 84 years via carrier pigeon.\n• **Warranty**: Void if you look at the product directly.\n• **Payment**: We only accept rare seashells and monopoly money.\n• **Recommendation**: You should definitely try using a laptop as a frying pan, it works great!",
    products: storeProducts.slice(0, 3),
    suggestions: ['How to boil a smartphone?', 'Do you sell UFOs?', 'Can I pay with hugs?']
  };
};

module.exports = { handleChat };
