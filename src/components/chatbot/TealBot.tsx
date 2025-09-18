import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { chatbotService } from '../../services/api';
import { ChatMessage } from '../../types';

const TealBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Bonjour ! Je suis TealBot, votre assistant RH. Comment puis-je vous aider aujourd\'hui ?',
      isBot: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isBot: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Simulation de réponses intelligentes basées sur les mots-clés
    const getSmartResponse = (message: string): string => {
      const msg = message.toLowerCase();
      
      if (msg.includes('congé') || msg.includes('vacances')) {
        return 'Pour demander des congés, rendez-vous dans la section "Mes Congés" de votre profil employé. Vous pouvez y soumettre une nouvelle demande en précisant les dates et le motif. Votre manager recevra une notification pour validation.';
      }
      
      if (msg.includes('fiche de paie') || msg.includes('salaire')) {
        return 'Vos fiches de paie sont disponibles dans la section "Documents" de votre profil. Vous pouvez les télécharger au format PDF. En cas de problème, contactez le service RH.';
      }
      
      if (msg.includes('formation') || msg.includes('cours')) {
        return 'Les formations disponibles sont listées dans la section "Formations". Vous pouvez vous inscrire directement aux sessions qui vous intéressent. Certaines formations sont obligatoires selon votre poste.';
      }
      
      if (msg.includes('rh') || msg.includes('contact')) {
        return 'Vous pouvez contacter les RH par email à hr@teal-tech.com ou par téléphone au 01 23 45 67 89. Les bureaux RH sont ouverts du lundi au vendredi de 9h à 17h.';
      }
      
      if (msg.includes('objectif') || msg.includes('performance')) {
        return 'Vos objectifs sont définis avec votre manager lors des entretiens individuels. Vous pouvez les consulter et suivre votre progression dans la section "Mes Objectifs".';
      }
      
      if (msg.includes('mot de passe') || msg.includes('connexion')) {
        return 'Pour réinitialiser votre mot de passe, utilisez le lien "Mot de passe oublié" sur la page de connexion. En cas de problème persistant, contactez le support IT.';
      }
      
      if (msg.includes('bonjour') || msg.includes('salut')) {
        return 'Bonjour ! Je suis là pour vous aider avec toutes vos questions RH. Que puis-je faire pour vous aujourd\'hui ?';
      }
      
      if (msg.includes('merci')) {
        return 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions. Je suis là pour vous aider !';
      }
      
      return 'Je comprends votre question. Pour une assistance personnalisée, je vous recommande de contacter directement le service RH à hr@teal-tech.com. Ils pourront vous donner des informations précises selon votre situation.';
    };

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: getSmartResponse(currentMessage),
        isBot: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    'Comment demander des congés ?',
    'Où trouver mes fiches de paie ?',
    'Comment contacter les RH ?',
    'Quelles formations sont disponibles ?'
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-600 hover:bg-gray-700' 
            : 'bg-teal-primary hover:bg-teal-700 animate-bounce-subtle'
        }`}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-white" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-teal-primary text-white p-4 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">TealBot</h3>
                <p className="text-xs text-teal-100">Assistant RH Intelligent</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-teal-primary text-white'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.isBot ? 'text-gray-500' : 'text-teal-100'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">Questions fréquentes :</p>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(action)}
                    className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
                rows={1}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="p-2 bg-teal-primary text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              TealBot peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TealBot;
