import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Fab, Paper, Typography, IconButton, TextField, 
  Avatar, Chip, Stack, CircularProgress, Card, CardContent,
  CardMedia, Button, Tooltip, Zoom, Fade, Divider
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SparklesIcon from '@mui/icons-material/AutoAwesome';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryIcon from '@mui/icons-material/Category';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { trainedBotEngine } from '../data/chatbotKnowledge';
import { sendChatbotMessage } from '../services/api';

const DEFAULT_SUGGESTIONS = [
  '⚡ Best laptops for coding',
  '📱 Phones under ₹1000',
  '⚔️ iPhone vs Samsung',
  '🎧 Best ANC headphones',
  '📦 Order & shipping info'
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: "Hi there! 👋 I'm **GadgetBot AI**, your trained tech shopping assistant.\n\nAsk me for product recommendations, compare gadgets, check prices, or inquire about store shipping & warranties!",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    products: []
  }
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const messagesEndRef = useRef(null);
  const { products } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const toggleChat = () => setIsOpen(prev => !prev);

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setActiveSuggestions(DEFAULT_SUGGESTIONS);
  };

  const handleSend = async (textToSend = null) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (typeof textToSend !== 'string') setInput('');
    setIsTyping(true);

    try {
      // 1. Attempt Gemini AI API via backend
      const apiResponse = await sendChatbotMessage(query, products);
      if (apiResponse && apiResponse.text) {
        const botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          text: apiResponse.text,
          products: apiResponse.products || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.info('Backend Gemini API endpoint unavailable, using trained local bot engine fallback');
    }

    // 2. Fallback to trained bot engine if API fails or is offline
    setTimeout(() => {
      const response = trainedBotEngine(query, products);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        products: response.products,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (response.suggestions && response.suggestions.length > 0) {
        setActiveSuggestions(response.suggestions);
      }

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}>
      {/* Expanded Chat Drawer window */}
      <Zoom in={isOpen}>
        <Paper
          elevation={12}
          sx={{
            position: 'absolute',
            bottom: 72,
            right: 0,
            width: { xs: 'calc(100vw - 32px)', sm: 400 },
            maxHeight: 600,
            height: '78vh',
            borderRadius: 4,
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            overflow: 'hidden',
            backdropFilter: 'blur(16px)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}
        >
          {/* Chat Header */}
          <Box 
            sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 42, boxShadow: '0 0 12px rgba(37,99,235,0.6)' }}>
                <SmartToyIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  GadgetBot AI <SparklesIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', display: 'inline-block' }} />
                  Trained AI Sales & Support Agent
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Clear Chat">
                <IconButton size="small" onClick={clearChat} sx={{ color: 'grey.400', '&:hover': { color: 'white' } }}>
                  <DeleteSweepIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton size="small" onClick={toggleChat} sx={{ color: 'grey.400', '&:hover': { color: 'white' } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Body */}
          <Box 
            sx={{ 
              p: 2, 
              flexGrow: 1, 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              bgcolor: 'background.default' 
            }}
          >
            {messages.map((msg) => (
              <Box 
                key={msg.id}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' 
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, maxWidth: '88%', alignItems: 'flex-start' }}>
                  {msg.sender === 'bot' && (
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', mt: 0.5 }}>
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.6,
                      borderRadius: 3,
                      borderTopLeftRadius: msg.sender === 'bot' ? 4 : 12,
                      borderTopRightRadius: msg.sender === 'user' ? 4 : 12,
                      bgcolor: msg.sender === 'user' ? 'primary.main' : 'action.selected',
                      color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                      boxShadow: 1
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        whiteSpace: 'pre-line',
                        lineHeight: 1.55,
                        fontWeight: 400 
                      }}
                    >
                      {msg.text}
                    </Typography>

                    {/* Product Cards Recommendations inside Chat */}
                    {msg.products && msg.products.length > 0 && (
                      <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                        {msg.products.map(product => (
                          <Card 
                            key={product.id} 
                            variant="outlined"
                            sx={{ 
                              display: 'flex', 
                              borderRadius: 2, 
                              overflow: 'hidden',
                              bgcolor: 'background.paper',
                              '&:hover': { boxShadow: 3 }
                            }}
                          >
                            <CardMedia
                              component="img"
                              sx={{ width: 72, height: 72, objectFit: 'cover' }}
                              image={product.image}
                              alt={product.name}
                            />
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 }, flexGrow: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1.2 }}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>
                                ₹{product.price}
                                {product.originalPrice && (
                                  <Typography component="span" variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', ml: 0.8 }}>
                                    ₹{product.originalPrice}
                                  </Typography>
                                )}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Button 
                                  size="small" 
                                  variant="contained" 
                                  sx={{ fontSize: '0.65rem', py: 0.2, px: 1, minWidth: 0, fontWeight: 700 }}
                                  onClick={() => {
                                    addToCart(product);
                                  }}
                                >
                                  + Cart
                                </Button>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ fontSize: '0.65rem', py: 0.2, px: 1, minWidth: 0 }}
                                  onClick={() => {
                                    setIsOpen(false);
                                    navigate(`/product/${product.id}`);
                                  }}
                                >
                                  Details
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </Paper>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.4, px: 1, fontSize: '0.65rem' }}>
                  {msg.time}
                </Typography>
              </Box>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                  <SmartToyIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Paper sx={{ p: 1.5, borderRadius: 3, bgcolor: 'action.selected' }}>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <CircularProgress size={14} color="primary" />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      GadgetBot AI is analyzing...
                    </Typography>
                  </Stack>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Dynamic Trained Suggestion Chips */}
          <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider', overflowX: 'auto', display: 'flex', gap: 0.8, whiteSpace: 'nowrap' }}>
            {activeSuggestions.map((chipText, i) => (
              <Chip
                key={i}
                label={chipText}
                size="small"
                onClick={() => handleSend(chipText)}
                clickable
                variant="outlined"
                color="primary"
                sx={{ fontSize: '0.72rem', height: 26, borderRadius: 2 }}
              />
            ))}
          </Box>

          {/* Input Box */}
          <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about laptops, phones, comparisons, deals..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
              <IconButton 
                color="primary" 
                onClick={() => handleSend()}
                disabled={!input.trim()}
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' }
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Zoom>

      {/* Floating Launcher FAB Button */}
      <Tooltip title={isOpen ? "Close Assistant" : "Ask GadgetBot AI"} placement="left">
        <Fab
          color="primary"
          onClick={toggleChat}
          sx={{
            width: 60,
            height: 60,
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.08) rotate(5deg)'
            }
          }}
        >
          {isOpen ? <CloseIcon /> : <SmartToyIcon sx={{ fontSize: 30 }} />}
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default AIChatbot;
