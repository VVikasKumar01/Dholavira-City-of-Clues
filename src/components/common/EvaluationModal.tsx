import React, { useState } from 'react';
import { GameAnalytics } from '../../types/game';
import { EVALUATION_QUESTIONS } from '../../data/prePostTest';
import { 
  X, 
  BarChart3, 
  Award, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  BookOpen, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  analytics: GameAnalytics;
  onClose: () => void;
  onSavePreTestScore: (score: number) => void;
  onSavePostTestScore: (score: number) => void;
}

export const EvaluationModal: React.FC<Props> = ({
  analytics,
  onClose,
  onSavePreTestScore,
  onSavePostTestScore,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'test'>('metrics');
  const [testMode, setTestMode] = useState<'pre' | 'post'>('pre');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState<number | null>(null);

  const totalAttempts = Object.values(analytics.puzzleAttempts).reduce((a, b) => a + b, 0);
  const totalCompleted = analytics.missionsCompleted.length;
  const puzzleSuccessRate = totalAttempts > 0 
    ? Math.round((totalCompleted / totalAttempts) * 100) 
    : (totalCompleted > 0 ? 100 : 0);
  const totalHints = Object.values(analytics.hintsUsed).reduce((a, b) => a + b, 0);
  const totalEvidenceDiscovered = analytics.evidenceDiscovered.length;

  const currentQ = EVALUATION_QUESTIONS[currentQuestionIdx];

  const handleSelectOption = (optionIdx: number) => {
    soundManager.playClick();
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionIdx,
    }));
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentQuestionIdx < EVALUATION_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Calculate score
      let correct = 0;
      EVALUATION_QUESTIONS.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correct++;
        }
      });
      const pct = Math.round((correct / EVALUATION_QUESTIONS.length) * 100);
      setTestScore(pct);
      setTestSubmitted(true);
      if (testMode === 'pre') {
        onSavePreTestScore(pct);
      } else {
        onSavePostTestScore(pct);
      }
      soundManager.playSuccess();
    }
  };

  const handleRestartTest = (mode: 'pre' | 'post') => {
    soundManager.playClick();
    setTestMode(mode);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTestSubmitted(false);
    setTestScore(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="stone-panel w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden border border-purple-500/30 shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-purple-500/20 flex items-center justify-between bg-[#120e22]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-archaeological font-bold text-lg text-[#f4efe6]">
                  RESEARCH & LEARNING EVALUATION PANEL
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-600/40">
                  SIH 2026 BENCHMARK
                </span>
              </div>
              <p className="text-xs text-[#a0907d]">
                Empirical gameplay analytics and pre/post-test pedagogical validation (Mortara et al., 2014; DaCosta & Kinsell, 2023).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1a2332] hover:bg-[#28364c] border border-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 py-2.5 bg-[#0b0816] border-b border-white/5 flex items-center gap-3 text-xs">
          <button
            onClick={() => { soundManager.playClick(); setActiveTab('metrics'); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'metrics'
                ? 'bg-purple-700 text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Gameplay Metrics & Session Telemetry
          </button>
          <button
            onClick={() => { soundManager.playClick(); setActiveTab('test'); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'test'
                ? 'bg-purple-700 text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Pre / Post Pedagogical Assessment
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-sandstone-pattern">
          {activeTab === 'metrics' ? (
            <div className="space-y-6">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-[#131024] border border-purple-500/20">
                  <span className="text-[10px] font-mono text-[#a0907d] uppercase tracking-wider block">
                    Missions Solved
                  </span>
                  <div className="text-2xl font-bold font-archaeological text-[#ffd9a8] mt-1">
                    {totalCompleted} <span className="text-stone-500 text-xs">/ 2</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                    Active Reconstruction
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#131024] border border-purple-500/20">
                  <span className="text-[10px] font-mono text-[#a0907d] uppercase tracking-wider block">
                    Evidence Discovered
                  </span>
                  <div className="text-2xl font-bold font-archaeological text-sky-400 mt-1">
                    {totalEvidenceDiscovered} <span className="text-stone-500 text-xs">/ 10</span>
                  </div>
                  <span className="text-[10px] text-sky-300 font-mono mt-1 block">
                    Field Inspection Rate
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#131024] border border-purple-500/20">
                  <span className="text-[10px] font-mono text-[#a0907d] uppercase tracking-wider block">
                    Reconstruction Accuracy
                  </span>
                  <div className="text-2xl font-bold font-archaeological text-purple-300 mt-1">
                    {puzzleSuccessRate}%
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                    {totalAttempts} Puzzle Attempts
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#131024] border border-purple-500/20">
                  <span className="text-[10px] font-mono text-[#a0907d] uppercase tracking-wider block">
                    Guidance Dependency
                  </span>
                  <div className="text-2xl font-bold font-archaeological text-amber-400 mt-1">
                    {totalHints}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                    Hints Requested
                  </span>
                </div>
              </div>

              {/* Learning Transfer Comparison Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-[#1b1532]/40 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <h4 className="font-archaeological font-bold text-base text-[#f5ebd9]">
                      Measurable Knowledge Transfer (Pre vs Post Assessment)
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-purple-300">
                    N = 5 Validated Item Bank
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center my-4">
                  <div className="p-4 rounded-xl bg-[#0f0c1a] border border-white/5">
                    <span className="text-xs text-[#a0907d] block">Pre-Investigation Score</span>
                    <span className="text-2xl font-bold text-stone-300 mt-1 block">
                      {analytics.preTestScore !== undefined ? `${analytics.preTestScore}%` : 'Not Taken'}
                    </span>
                    <span className="text-[10px] text-[#8e7a68]">Baseline historical recall</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0f0c1a] border border-white/5">
                    <span className="text-xs text-[#a0907d] block">Post-Investigation Score</span>
                    <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                      {analytics.postTestScore !== undefined ? `${analytics.postTestScore}%` : 'Not Taken'}
                    </span>
                    <span className="text-[10px] text-emerald-500/80">After active reconstruction</span>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/40">
                    <span className="text-xs text-purple-300 block">Measured Knowledge Delta</span>
                    <span className="text-2xl font-bold text-[#ffd9a8] mt-1 block">
                      {analytics.preTestScore !== undefined && analytics.postTestScore !== undefined
                        ? `+${Math.max(0, analytics.postTestScore - analytics.preTestScore)}%`
                        : 'Pending Test'}
                    </span>
                    <span className="text-[10px] text-purple-300 font-mono">Learning-by-doing gain</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-white/10">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab('test');
                      handleRestartTest('pre');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#211a3d] hover:bg-[#2c2250] text-purple-200 text-xs font-semibold cursor-pointer border border-purple-500/30"
                  >
                    Take Pre-Test
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab('test');
                      handleRestartTest('post');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Take Post-Test
                  </button>
                </div>
              </div>

              {/* Research Methodology Note */}
              <div className="p-4 rounded-xl bg-[#110e1f] border border-white/5 text-xs text-[#a0907d] space-y-1.5">
                <span className="font-semibold text-stone-300 block">
                  SIH 2026 Academic Research Foundation:
                </span>
                <p>
                  "Rather than assessing passive recognition (quizzes), serious games achieve sustained learning retention when archaeological evidence is directly transformed into system puzzles and physical reconstructions."
                </p>
                <p className="font-mono text-[10px] text-purple-400">
                  Ref: Cheng, Cang & Zhou (2025); DaCosta & Kinsell (2023); Mortara et al. (2014)
                </p>
              </div>

            </div>
          ) : (
            /* Pre/Post Test Interactive Mode */
            <div className="max-w-2xl mx-auto space-y-5">
              {!testSubmitted ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40">
                        {testMode === 'pre' ? 'Pre-Test Assessment' : 'Post-Test Assessment'}
                      </span>
                      <h4 className="font-archaeological font-bold text-lg text-[#f4efe6] mt-1.5">
                        Question {currentQuestionIdx + 1} of {EVALUATION_QUESTIONS.length}
                      </h4>
                    </div>
                    <div className="text-xs font-mono text-purple-400">
                      Step {currentQuestionIdx + 1}/{EVALUATION_QUESTIONS.length}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#130f24] border border-purple-500/20">
                    <p className="text-sm sm:text-base font-medium text-[#ffd9a8] leading-relaxed mb-4">
                      {currentQ.question}
                    </p>

                    <div className="space-y-2.5">
                      {currentQ.options.map((option, idx) => {
                        const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-3 ${
                              isSelected
                                ? 'bg-purple-950/80 border-purple-400 text-white font-medium shadow-md'
                                : 'bg-[#18132e] border-white/5 text-[#d8cbba] hover:bg-[#201a3d]'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                              isSelected ? 'border-purple-300 bg-purple-600 text-white' : 'border-stone-600 text-stone-400'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[11px] text-[#8e7a68]">
                      All questions are sourced directly from peer-reviewed excavation reports.
                    </span>

                    <button
                      disabled={selectedAnswers[currentQuestionIdx] === undefined}
                      onClick={handleNextQuestion}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      {currentQuestionIdx < EVALUATION_QUESTIONS.length - 1 ? 'NEXT QUESTION →' : 'SUBMIT ASSESSMENT'}
                    </button>
                  </div>
                </>
              ) : (
                /* Test Results View */
                <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-300 mx-auto">
                    <Award className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="font-archaeological font-bold text-2xl text-[#f4efe6]">
                      {testMode === 'pre' ? 'Pre-Test' : 'Post-Test'} Completed!
                    </h3>
                    <p className="text-xs text-[#a0907d] mt-1">
                      Score recorded in local evaluation metrics.
                    </p>
                  </div>

                  <div className="inline-block px-6 py-4 rounded-2xl bg-purple-950/50 border border-purple-500/40">
                    <span className="text-xs font-mono text-purple-300 uppercase block">
                      Assessment Score
                    </span>
                    <span className="text-4xl font-extrabold text-[#ffd9a8] font-archaeological">
                      {testScore}%
                    </span>
                  </div>

                  {/* Review of all questions */}
                  <div className="text-left space-y-3 pt-4 border-t border-white/10 max-h-72 overflow-y-auto pr-1">
                    {EVALUATION_QUESTIONS.map((q, idx) => {
                      const userAns = selectedAnswers[idx];
                      const isCorrect = userAns === q.correctIndex;
                      return (
                        <div key={q.id} className="p-3 rounded-xl bg-[#130f24] border border-white/5 text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            {isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <span className="font-medium text-[#ffd9a8]">{q.question}</span>
                          </div>
                          <p className="text-[#a0907d] text-[11px] mt-1">
                            {q.explanation}
                          </p>
                          <span className="text-[10px] text-purple-400 font-mono block mt-1">
                            Source: {q.sourceReference}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setActiveTab('metrics')}
                    className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    RETURN TO DASHBOARD
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0814] border-t border-white/10 flex items-center justify-between text-xs text-[#8e7a68]">
          <span>SIH 2026 Evaluation Suite • Educational Serious Game Prototype</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#251e3e] hover:bg-[#342b54] text-purple-200 text-xs font-semibold cursor-pointer"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
};
