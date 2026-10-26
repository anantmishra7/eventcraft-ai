import React, { useState, useRef, useEffect } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { EventPlan } from '@eventcraft/shared';
import styles from './ChatAssistant.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  updatedPlan?: EventPlan;
}

export const ChatAssistant: React.FC = () => {
  const { currentPlan, updatePlan } = usePlan();
  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        'Hello! I am your EventCraft AI planner. You can ask me to adjust your budget, add cultural rituals (like Mehendi or Haldi), change styling themes, or optimize catering costs. How can I assist you?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!currentPlan) return null;

  const quickPrompts = [
    'Make this celebration 15% cheaper',
    'Add a Mehendi & Haldi ritual ceremony',
    'Change theme to Rustic Bohemian Chic',
    'Add live food stations & vegan mocktails',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage({
        message: text,
        currentPlan,
        chatHistory: messages.map(m => ({ role: m.role, content: m.content })),
      });

      const assistantMsg: Message = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        updatedPlan: response.updatedPlan,
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If user directly requested to apply, or if it came with an updated plan
      if (response.updatedPlan) {
        showToast('AI suggested plan updates are available in chat!', 'info');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Chat error';
      showToast(msg, 'danger');
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: 'I encountered an issue processing that request. Please try again or rephrase.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyUpdatedPlan = (plan: EventPlan) => {
    updatePlan(plan);
    showToast('Plan updated successfully from AI Assistant!', 'success');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        id="floating-chat-btn"
        type="button"
        className={styles.floatingBtn}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close AI Planner Assistant' : 'Open AI Planner Assistant'}
        aria-expanded={isOpen}
      >
        <span className={styles.btnIcon} aria-hidden="true">
          {isOpen ? '✕' : '💬'}
        </span>
        <span className={styles.btnLabel}>AI Assistant</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <aside
          id="chat-drawer"
          className={styles.drawer}
          aria-label="AI Event Planner Chat Assistant"
          role="complementary"
        >
          {/* Header */}
          <div className={styles.drawerHeader}>
            <div className={styles.headerInfo}>
              <span className={styles.botIcon} aria-hidden="true">
                ✨
              </span>
              <div>
                <h3 className={styles.headerTitle}>EventCraft Assistant</h3>
                <span className={styles.headerSub}>Context-aware AI co-planner</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant panel"
            >
              ✕
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className={styles.quickBar}>
            <span className={styles.quickLabel}>Suggested Prompts:</span>
            <div className={styles.quickPills}>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={styles.quickPill}
                  onClick={() => handleSendMessage(p)}
                  disabled={isLoading}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className={styles.messagesWrap} aria-live="polite">
            {messages.map(m => (
              <div
                key={m.id}
                className={`${styles.messageBubble} ${
                  m.role === 'user' ? styles.userBubble : styles.assistantBubble
                }`}
              >
                <div className={styles.bubbleHeader}>
                  <span className={styles.sender}>
                    {m.role === 'user' ? 'You' : 'EventCraft AI'}
                  </span>
                </div>
                <div className={styles.bubbleText}>{m.content}</div>

                {/* If assistant returned an updated plan */}
                {m.updatedPlan && (
                  <div className={styles.planSyncBox}>
                    <span className={styles.syncIcon} aria-hidden="true">
                      ⚡
                    </span>
                    <div className={styles.syncContent}>
                      <strong>Plan adjustments ready to apply</strong>
                      <p>
                        Total Budget: ₹
                        {m.updatedPlan.eventInput.totalBudget.toLocaleString('en-IN')}
                      </p>
                      <button
                        type="button"
                        className={styles.applyBtn}
                        onClick={() => handleApplyUpdatedPlan(m.updatedPlan!)}
                      >
                        ✓ Apply Updates to Current Plan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.messageBubble} ${styles.assistantBubble}`}>
                <div className={styles.loadingDots} aria-label="AI is thinking...">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            className={styles.inputArea}
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className={styles.textInput}
              placeholder="Ask AI (e.g. 'Make it ₹1 Lakh cheaper')..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              disabled={isLoading}
              maxLength={500}
              aria-label="Message to AI Assistant"
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={isLoading || !inputMessage.trim()}
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </aside>
      )}
    </>
  );
};
