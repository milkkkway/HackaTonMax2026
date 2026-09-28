import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { StatusBar } from './components/max/StatusBar';
import { MaxHeader } from './components/max/MaxHeader';
import { BottomNavBar } from './components/max/BottomNavBar';
import { ScreenAuth } from './components/auth/ScreenAuth';
import { ScreenStudentProfile } from './components/student/ScreenStudentProfile';
import { ScreenStudentVacancies } from './components/student/ScreenStudentVacancies';
import { ScreenStudentPortfolio } from './components/student/ScreenStudentPortfolio';
import { ScreenStudentReviews } from './components/student/ScreenStudentReviews';
import { ScreenEmployerCompany } from './components/employer/ScreenEmployerCompany';
import { ScreenEmployerTasks } from './components/employer/ScreenEmployerTasks';
import { ScreenEmployerResponses } from './components/employer/ScreenEmployerResponses';
import { ScreenEmployerPortfolio } from './components/employer/ScreenEmployerPortfolio';
import { ScreenEmployerReviews } from './components/employer/ScreenEmployerReviews';
import { ChatModal } from './components/modals/ChatModal';
import { StudentProfilePreviewModal } from './components/modals/StudentProfilePreviewModal';
import { ApplyModal } from './components/modals/ApplyModal';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { AddProjectModal } from './components/modals/AddProjectModal';
import { ChangePasswordModal } from './components/modals/ChangePasswordModal';
import { DeployGuideModal } from './components/modals/DeployGuideModal';
import { Vacancy, Application } from './types';
import { maxBridge } from './services/maxBridge';
import { Smartphone, Monitor, BookOpen } from 'lucide-react';

function AppContent() {
  const {
    currentUser,
    currentRole,
    studentTab,
    employerTab,
    activeDealId,
    previewStudentId,
    isDeployGuideOpen,
    openChatForApplication,
    openChatForDeal,
    closeChat,
    setPreviewStudentId,
    setIsDeployGuideOpen,
    setEmployerTab,
  } = useApp();

  // Modals state
  const [applyVacancy, setApplyVacancy] = useState<Vacancy | null>(null);
  const [selectedVacancyDetail, setSelectedVacancyDetail] = useState<Vacancy | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [selectedTaskForResponses, setSelectedTaskForResponses] = useState<string | null>(null);

  // Desktop simulator frame toggle
  const [isDeviceFramed, setIsDeviceFramed] = useState<boolean>(true);

  // Auto-detect if opened in native mobile webview / touch screen
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setIsDeviceFramed(false);
    }
  }, []);

  const handleOpenResponsesForTask = (taskId: string) => {
    setSelectedTaskForResponses(taskId);
    setEmployerTab('responses');
  };

  return (
    <div className="min-h-screen bg-[#DDE3EA] flex flex-col justify-center items-center p-0 sm:p-4 select-none overflow-x-hidden font-sans text-[#121316]">
      {/* Top Desktop Controls Bar (Only shown on wider screens) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-2 px-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-[#BAEA55] border border-black/40" />
          <span>МАХ 2026 Mini App Environment</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDeployGuideOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#141517] hover:text-black bg-white px-2.5 py-1 rounded-full shadow-2xs border border-slate-300 transition-all active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Деплой</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeviceFramed(!isDeviceFramed)}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-black bg-white/70 px-2 py-1 rounded-full border border-slate-300 transition-all"
            title="Переключить рамку смартфона"
          >
            {isDeviceFramed ? <Smartphone className="w-3.5 h-3.5 text-black" /> : <Monitor className="w-3.5 h-3.5" />}
            <span>{isDeviceFramed ? '375×812' : 'Полноэкранный'}</span>
          </button>
        </div>
      </div>

      {/* Main Container / Phone Container */}
      <div
        className={`w-full bg-[#EEF6E1] text-[#121316] flex flex-col relative transition-all duration-300 ${
          isDeviceFramed
            ? 'max-w-[390px] h-[844px] rounded-[44px] overflow-hidden shadow-2xl border-[6px] border-[#141517] my-auto'
            : 'min-h-screen max-w-md shadow-lg border-x border-slate-300'
        }`}
      >
        {/* Top Phone Status Bar */}
        <StatusBar dark />

        {/* MAX Messenger Header with BackButton & Action Menu */}
        <MaxHeader
          showBack={selectedVacancyDetail !== null}
          onBack={() => setSelectedVacancyDetail(null)}
        />

        {/* Content Body */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {!currentUser ? (
            /* Auth / Welcome / Role Selection */
            <ScreenAuth />
          ) : currentRole === 'student' ? (
            /* Student Views */
            <>
              {studentTab === 'profile' && (
                <ScreenStudentProfile
                  onOpenPreview={(id) => setPreviewStudentId(id)}
                  onOpenChangePass={() => setIsChangePassOpen(true)}
                />
              )}

              {studentTab === 'vacancies' && (
                <ScreenStudentVacancies
                  onSelectVacancy={(vac) => setSelectedVacancyDetail(vac)}
                  onApplyVacancy={(vac) => setApplyVacancy(vac)}
                  onOpenChatForDealId={(dealId) => openChatForDeal(dealId)}
                />
              )}

              {studentTab === 'portfolio' && (
                <ScreenStudentPortfolio
                  onAddManualProject={() => setIsAddProjectOpen(true)}
                  onOpenChatForDealId={(dealId) => openChatForDeal(dealId)}
                />
              )}

              {studentTab === 'reviews' && <ScreenStudentReviews />}
            </>
          ) : (
            /* Employer Views */
            <>
              {employerTab === 'company' && <ScreenEmployerCompany />}

              {employerTab === 'tasks' && (
                <ScreenEmployerTasks
                  onOpenCreateTask={() => setIsCreateTaskOpen(true)}
                  onOpenResponsesForTask={handleOpenResponsesForTask}
                />
              )}

              {employerTab === 'responses' && (
                <ScreenEmployerResponses
                  initialVacancyId={selectedTaskForResponses}
                  onPreviewStudent={(id) => setPreviewStudentId(id)}
                  onOpenChat={(app) => openChatForApplication(app)}
                />
              )}

              {employerTab === 'portfolio' && (
                <ScreenEmployerPortfolio
                  onOpenChatForDealId={(dealId) => openChatForDeal(dealId)}
                />
              )}

              {employerTab === 'reviews' && <ScreenEmployerReviews />}
            </>
          )}
        </main>

        {/* Floating Bottom Navigation Bar */}
        {currentUser && <BottomNavBar />}

        {/* iOS Home Indicator Bar */}
        <div className="w-32 h-1 bg-black/60 rounded-full mx-auto my-1.5 shrink-0 pointer-events-none z-30" />
      </div>

      {/* --- Modals & Overlays --- */}

      {/* Vacancy Detail Overlay */}
      {selectedVacancyDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none">
          <div className="bg-white text-[#121316] rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl border-4 border-black/80 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-[#141517] text-white flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-[#BAEA55] uppercase tracking-wider">
                Детали проектного кейса
              </span>
              <button
                type="button"
                onClick={() => setSelectedVacancyDetail(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {selectedVacancyDetail.companyName} • {selectedVacancyDetail.city}
                </span>
                <h3 className="font-extrabold text-base text-[#121316] mt-0.5 leading-snug">
                  {selectedVacancyDetail.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                    {selectedVacancyDetail.budget.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-[#EEF6E1] px-2.5 py-1 rounded-full border border-emerald-200">
                    {selectedVacancyDetail.format}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Дедлайн: {new Date(selectedVacancyDetail.deadline).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-[11px] text-slate-400 uppercase tracking-wider mb-1.5">
                  Техническое задание
                </h4>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedVacancyDetail.description}
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-[11px] text-slate-400 uppercase tracking-wider mb-1.5">
                  Требуемый стек
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVacancyDetail.requiredSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-[#141517] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedVacancyDetail(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-black"
              >
                Закрыть
              </button>
              {currentRole === 'student' && (
                <button
                  type="button"
                  onClick={() => {
                    const vac = selectedVacancyDetail;
                    setSelectedVacancyDetail(null);
                    setApplyVacancy(vac);
                  }}
                  className="bg-[#BAEA55] hover:bg-[#c2f35d] text-black font-extrabold px-4 py-2 rounded-xl text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Откликнуться на кейс →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat & Safe Deal Modal */}
      {activeDealId && <ChatModal dealId={activeDealId} onClose={closeChat} />}

      {/* Apply Modal */}
      {applyVacancy && (
        <ApplyModal
          vacancy={applyVacancy}
          onClose={() => setApplyVacancy(null)}
          onSuccess={() => {
            setApplyVacancy(null);
            // Open chat right after applying!
          }}
        />
      )}

      {/* Student Profile Preview Modal */}
      {previewStudentId && (
        <StudentProfilePreviewModal
          studentId={previewStudentId}
          onClose={() => setPreviewStudentId(null)}
          onStartChat={() => {
            // Find application for this student
            // Handled inside
          }}
        />
      )}

      {/* Create Task Modal */}
      {isCreateTaskOpen && <CreateTaskModal onClose={() => setIsCreateTaskOpen(false)} />}

      {/* Add Manual Project Modal */}
      {isAddProjectOpen && <AddProjectModal onClose={() => setIsAddProjectOpen(false)} />}

      {/* Change Password Modal */}
      {isChangePassOpen && <ChangePasswordModal onClose={() => setIsChangePassOpen(false)} />}

      {/* Deploy Guide Modal */}
      {isDeployGuideOpen && <DeployGuideModal onClose={() => setIsDeployGuideOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
