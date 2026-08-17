import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  Copy,
  Check,
  Mic,
  MicOff,
  Paperclip,
  ArrowLeft,
  Scan,
  Sparkles,
  Home,
  Database,
  Code2,
} from 'lucide-react';
import { AppScreen, ChatMessage, UserProfile } from '../types';
import { saveChatMessage, subscribeChatMessages } from '../lib/databaseService';

interface AITutorScreenProps {
  user: UserProfile;
  initialTopic?: string;
  onNavigate: (screen: AppScreen) => void;
}

const defaultSeedMessages: ChatMessage[] = [
  {
    id: 'msg-seed-1',
    sender: 'user',
    text: 'Can you explain how a binary search tree works in Python? I need a basic example.',
    timestamp: 'Today, 14:30',
    tag: 'Python Basics',
  },
  {
    id: 'msg-seed-2',
    sender: 'tutor',
    text: 'A Binary Search Tree (BST) is a node-based data structure where each node has at most two children:\n\n• The left subtree holds keys strictly lesser than the parent.\n• The right subtree holds keys strictly greater than the parent.\n• Both subtrees are also binary search trees.\n\nHere is a clean implementation in Python:',
    codeSnippet: {
      language: 'python',
      code: `class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.val:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root`,
    },
    timestamp: 'Today, 14:31',
  },
];

const promptSuggestions = [
  'Explain for Interview',
  'Show Usage Example',
  'Time Complexity O(log n)',
  'Convert to C++ Smart Pointers',
  'AVL Balance Factor Rotations',
];

export const AITutorScreen: React.FC<AITutorScreenProps> = ({
  user,
  initialTopic,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(defaultSeedMessages);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [dbStatus, setDbStatus] = useState<'synced' | 'saving'>('synced');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const scholarUid = user.email ? 'scholar-' + btoa(user.email).slice(0, 10) : 'scholar-alex-vance';

  // Load chat messages from Firestore or fallback
  useEffect(() => {
    const unsubscribe = subscribeChatMessages(scholarUid, (remoteMsgs) => {
      if (remoteMsgs && remoteMsgs.length > 0) {
        setMessages(remoteMsgs);
      }
    });

    if (initialTopic) {
      handleSendPrompt(`Could you provide a detailed technical walkthrough of ${initialTopic}?`);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [scholarUid]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendPrompt = async (promptText?: string) => {
    const query = promptText || inputVal.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);
    setDbStatus('saving');

    await saveChatMessage(scholarUid, userMsg);

    setTimeout(async () => {
      const lower = query.toLowerCase();
      let replyText = '';
      let codeObj: { language: string; code: string } | undefined = undefined;

      if (lower.includes('complexity') || lower.includes('time')) {
        replyText = `**Time & Space Complexity Analysis:**\n\n• **Search / Insert / Delete (Average)**: $O(\\log n)$\n• **Search / Insert / Delete (Worst-case / Degenerate chain)**: $O(n)$\n• **Space Complexity**: $O(n)$ total space, $O(h)$ call stack recursion frame depth where $h$ is the tree height.\n\nTo enforce the $O(\\log n)$ upper bound unconditionally, self-balancing structures like **AVL Trees** or **Red-Black Trees** perform constant-time rotations upon invariant violations.`;
      } else if (lower.includes('interview') || lower.includes('question')) {
        replyText = `**Top Interview Takeaways & Edge Cases:**\n\n1. **BST Inorder Traversal Property**: An inorder traversal of a BST always yields keys in monotonically non-decreasing order.\n2. **Valid BST Validation**: Avoid only comparing children to parent. You must propagate strict lower and upper bounds across the entire recursive path.\n3. **Lowest Common Ancestor (LCA)**: In a BST, LCA is simply the first node $N$ where $p \\le N \\le q$.`;
      } else if (lower.includes('c++') || lower.includes('pointer')) {
        replyText = `Here is the modern C++20 implementation using smart pointers (\`std::unique_ptr\`):`;
        codeObj = {
          language: 'cpp',
          code: `#include <iostream>
#include <memory>

struct Node {
    int val;
    std::unique_ptr<Node> left;
    std::unique_ptr<Node> right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

void insert(std::unique_ptr<Node>& root, int key) {
    if (!root) {
        root = std::make_unique<Node>(key);
        return;
    }
    if (key < root->val) insert(root->left, key);
    else if (key > root->val) insert(root->right, key);
}`,
        };
      } else {
        replyText = `That's a great computer science question about **${query}**!\n\nIn systems engineering and distributed computing, understanding these core architectural invariants ensures deterministic throughput and optimal resource utilization. Would you like me to walk through the mathematical proof, show interactive C++ memory traces, or launch an AR 3D model?`;
      }

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: replyText,
        codeSnippet: codeObj,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tutorMsg]);
      setIsTyping(false);
      setDbStatus('synced');

      await saveChatMessage(scholarUid, tutorMsg);
    }, 850);
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setInputVal('Can you explain time complexity of tree rotations?');
        setIsRecording(false);
      }, 1800);
    }
  };

  return (
    <div
      id="ai-tutor-screen"
      className="bg-[#0b0f19] text-[#dfe2ef] min-h-screen relative overflow-hidden flex flex-col font-sans"
    >
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="fixed top-0 w-full z-40 backdrop-blur-xl bg-[#0e121e]/85 border-b border-white/10 flex justify-between items-center px-4 sm:px-6 h-16 max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-sm">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <span>CodeMind AI Tutor</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {dbStatus === 'saving' ? 'Saving...' : 'Firestore Synced'}
              </span>
            </h1>
            <p className="text-[11px] font-mono text-cyan-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Scholar: {user.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigate('scanner')}
            title="Launch AR Scanner"
            className="flex items-center gap-1 text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer"
          >
            <Scan size={14} />
            <span className="hidden sm:inline">AR Scan</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            title="Dashboard"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Home size={18} />
          </button>
        </div>
      </header>

      {/* Main Chat Stream */}
      <main className="flex-1 relative z-10 flex flex-col pt-20 pb-44 sm:pb-36 px-4 max-w-4xl mx-auto w-full h-full overflow-y-auto">
        <div className="flex flex-col gap-5 py-2">
          {/* Sync Header Chip */}
          <div className="flex justify-center mt-1">
            <span className="bg-[#141824]/90 text-slate-400 font-mono text-[11px] px-3.5 py-1 rounded-full border border-white/10 shadow-sm flex items-center gap-2">
              <Database size={12} className="text-emerald-400" />
              <span>Real-time Persistent Conversation Stream</span>
            </span>
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col w-full ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {msg.sender === 'user' ? (
                <div className="flex items-end gap-2 max-w-[88%] sm:max-w-[75%]">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-br-sm px-4 sm:px-5 py-3 shadow-md border border-indigo-500/30">
                    <p className="text-sm sm:text-base leading-relaxed">{msg.text}</p>
                    <span className="text-[10px] font-mono text-indigo-200/60 block text-right mt-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 max-w-[96%] sm:max-w-[85%]">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 flex-shrink-0 mt-1">
                    <Bot size={16} />
                  </div>

                  <div className="bg-[#141824]/90 backdrop-blur-md text-slate-200 rounded-2xl rounded-tl-sm p-4 sm:p-5 border border-white/10 shadow-xl space-y-3 w-full">
                    <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-200">
                      {msg.text}
                    </div>

                    {/* Code Snippet Block */}
                    {msg.codeSnippet && (
                      <div className="bg-[#0b0e17] rounded-xl p-3.5 font-mono text-xs sm:text-sm border border-white/10 overflow-x-auto shadow-inner relative group my-2">
                        <div className="flex justify-between items-center pb-2 mb-2 border-b border-white/10 text-xs font-mono text-slate-400">
                          <span className="uppercase text-cyan-300 flex items-center gap-1.5">
                            <Code2 size={13} />
                            {msg.codeSnippet.language}
                          </span>
                          <button
                            onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                            className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-2.5 py-1 rounded-md transition-all text-xs cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check size={12} className="text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="font-mono text-slate-200 whitespace-pre leading-relaxed">
                          <code>{msg.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1 text-[10px] font-mono text-slate-500">
                      <span>CodeMind AI Engine</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3 w-full mt-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-[#141824]/90 backdrop-blur-md rounded-2xl rounded-tl-sm px-4 py-3 border border-white/10 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>
      </main>

      {/* Sticky Bottom Input & Prompt Chips */}
      <div className="fixed bottom-0 left-0 w-full z-30 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/95 to-transparent pt-6 pb-20 sm:pb-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-2.5">
          {/* Suggested Prompts Horizon Scroll */}
          <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar -mx-2 px-2">
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendPrompt(prompt)}
                className="whitespace-nowrap flex-shrink-0 bg-[#141824]/90 hover:bg-[#1c2233] border border-white/10 hover:border-indigo-400/50 text-slate-300 hover:text-white font-mono text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Field Container */}
          <div className="bg-[#141824]/90 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl focus-within:border-indigo-400 transition-all">
            <div className="flex items-center px-3 py-2 gap-2">
              <button
                type="button"
                onClick={() => handleSendPrompt('Analyze this memory leak diagram from my compiler output.')}
                title="Attach Diagram or Code"
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <Paperclip size={18} />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendPrompt();
                  }
                }}
                placeholder="Ask your AI Tutor about Computer Science..."
                className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-0 p-0 font-sans"
              />

              {/* Mic Button */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                title="Voice Input"
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendPrompt()}
                disabled={!inputVal.trim() && !isTyping}
                title="Send Message"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
