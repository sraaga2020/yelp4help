import React from 'react';
import { Message, RiskTier } from '../types';

interface ChatMessageProps {
  message: Message;
}

const determineTier = (content: string): RiskTier => {
  if (content.includes('🚨 EMERGENCY DETECTED')) return 'TIER_1';
  if (content.includes('⚠️ STATUS UPDATE: MEDIUM RISK LEVEL')) return 'TIER_2';
  if (content.includes('✅ STATUS UPDATE: LOW RISK LEVEL')) return 'TIER_3';
  return 'UNKNOWN';
};

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Simple parser to handle newlines, **bold** text, and special dispatch blocks
  const lines = text.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, lineIndex) => {
        if (line.trim() === '') return <div key={lineIndex} className="h-2" />;
        
        // Handle the separator line for TIER 1
        if (line.includes('--------------------------------------------------')) {
          return <hr key={lineIndex} className="my-4 border-slate-500/30" />;
        }

        // Handle the automated dispatch payload block
        if (line.startsWith('[CALL_TRIGGER]')) {
          return (
            <div key={lineIndex} className="mt-4 p-3 bg-slate-950 rounded-md border border-red-500/30 font-mono text-xs md:text-sm text-red-400 shadow-inner">
              <div className="flex items-center gap-2 mb-1 text-red-500 font-bold">
                <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AUTOMATED DISPATCH PAYLOAD
              </div>
              {line.replace('[CALL_TRIGGER]', '').trim()}
            </div>
          );
        }
        
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={lineIndex} className="leading-relaxed">
            {parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIndex} className="font-bold text-inherit">{part.slice(2, -2)}</strong>;
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const tier = isUser ? 'UNKNOWN' : determineTier(message.content);

  let containerClasses = "flex w-full mb-6 ";
  containerClasses += isUser ? "justify-end" : "justify-start";

  let bubbleClasses = "max-w-[85%] md:max-w-[75%] rounded-2xl p-5 shadow-sm ";
  
  if (isUser) {
    bubbleClasses += "bg-blue-600 text-white rounded-tr-sm";
  } else {
    bubbleClasses += "bg-slate-800 text-slate-100 rounded-tl-sm border-l-4 ";
    switch (tier) {
      case 'TIER_1':
        bubbleClasses += "border-red-500 bg-red-950/30";
        break;
      case 'TIER_2':
        bubbleClasses += "border-amber-500 bg-amber-950/30";
        break;
      case 'TIER_3':
        bubbleClasses += "border-emerald-500 bg-emerald-950/30";
        break;
      default:
        bubbleClasses += "border-slate-600";
    }
  }

  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>
        <div className="flex items-center mb-2 opacity-70 text-xs font-medium uppercase tracking-wider">
          {isUser ? (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Citizen Input
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Aegis System Response
            </span>
          )}
        </div>
        <div className="text-sm md:text-base">
          <FormattedText text={message.content} />
        </div>
      </div>
    </div>
  );
};
