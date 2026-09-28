import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { maxBridge } from '../../services/maxBridge';
import { MoreVertical, X, Share2, HelpCircle, LogOut, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';

interface MaxHeaderProps {
  onBack?: () => void;
  showBack?: boolean;
}

export const MaxHeader: React.FC<MaxHeaderProps> = ({ onBack, showBack = false }) => {
  const { currentUser, currentRole, logout, quickLogin, setIsDeployGuideOpen } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleShare = () => {
    maxBridge.shareCase('Биржа проектов и кейсов для студентов в МАХ', 'https://max.ru/CasesBot?startapp=share_main');
    setMenuOpen(false);
  };

  const handleClose = () => {
    maxBridge.haptic('light');
    maxBridge.closeApp();
  };

  return (
    <div className="relative w-full z-40 bg-white/70 backdrop-blur-md border-b border-black/5 px-4 py-2 flex items-center justify-between shadow-2xs">
      {/* Left: Back button or MAX Logo */}
      <div className="flex items-center gap-2.5">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={() => {
              maxBridge.haptic('light');
              onBack();
            }}
            className="w-8 h-8 rounded-full bg-white shadow-xs border border-black/5 flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Назад"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#141517] to-[#25282d] p-[2px] shadow-xs flex items-center justify-center text-[#BAEA55] font-black text-sm">
            M
          </div>
        )}

        <div>
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="font-extrabold text-[14px] text-[#121316] tracking-tight">МАХ Кейсы</span>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9.5px] font-bold bg-[#BAEA55] text-black">
              2026
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block -mt-0.5">
            {currentRole === 'student' ? 'Кабинет Студента' : currentRole === 'employer' ? 'Кабинет Работодателя' : 'Мини-приложение VK'}
          </span>
        </div>
      </div>

      {/* Right: Quick actions & MAX Messenger Menu */}
      <div className="flex items-center gap-1.5">
        {/* Deploy Guide Quick Button */}
        <button
          type="button"
          onClick={() => {
            maxBridge.haptic('light');
            setIsDeployGuideOpen(true);
          }}
          className="hidden xs:flex items-center gap-1 bg-[#141517] text-white hover:bg-black text-[10.5px] font-bold px-2.5 py-1 rounded-full shadow-2xs transition-all active:scale-95"
          title="Инструкция по подключению в МАХ"
        >
          <span className="w-2 h-2 rounded-full bg-[#BAEA55] animate-pulse" />
          <span>Деплой в МАХ</span>
        </button>

        {/* 3-Dots MAX Native Menu Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              maxBridge.haptic('light');
              setMenuOpen(!menuOpen);
            }}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-black/5 shadow-2xs flex items-center justify-center text-slate-800 transition-all active:scale-95"
            aria-label="Меню"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-10 w-60 bg-[#141517] text-white rounded-2xl shadow-2xl border border-white/10 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-white/10 text-[11px] text-slate-400">
                {currentUser ? (
                  <div>
                    <div className="font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-[#BAEA55]">
                      {currentRole === 'student' ? 'Студент / Исполнитель' : 'Работодатель / Заказчик'}
                    </div>
                  </div>
                ) : (
                  'Не авторизован'
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDeployGuideOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <HelpCircle className="w-4 h-4 text-[#BAEA55]" />
                <span>Инструкция по деплою в МАХ</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>Поделиться в чате МАХ</span>
              </button>

              <div className="my-1 border-t border-white/10 pt-1">
                <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Быстрый вход для тестов
                </span>
                <div className="grid grid-cols-2 gap-1 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      quickLogin('student-1');
                      setMenuOpen(false);
                    }}
                    className="text-left text-[11px] p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 truncate"
                  >
                    🎓 Александр
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      quickLogin('student-2');
                      setMenuOpen(false);
                    }}
                    className="text-left text-[11px] p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 truncate"
                  >
                    🎓 Екатерина
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      quickLogin('employer-1');
                      setMenuOpen(false);
                    }}
                    className="text-left text-[11px] p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 truncate"
                  >
                    💼 VK Tech
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      quickLogin('employer-2');
                      setMenuOpen(false);
                    }}
                    className="text-left text-[11px] p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 truncate"
                  >
                    💼 Ритейл
                  </button>
                </div>
              </div>

              {currentUser && (
                <div className="mt-1 border-t border-white/10 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выйти из аккаунта</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Close Button × */}
        <button
          type="button"
          onClick={handleClose}
          className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-black/5 shadow-2xs flex items-center justify-center text-slate-800 transition-all active:scale-95"
          aria-label="Закрыть Mini App"
          title="Закрыть приложение"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
