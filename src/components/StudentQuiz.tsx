import React, { useState } from 'react';
import { ELECTRICAL_QUIZ_QUESTIONS } from '../data/quizData';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  BookOpen, 
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface StudentQuizProps {
  showFrenchTerms: boolean;
}

export const StudentQuiz: React.FC<StudentQuizProps> = ({ showFrenchTerms }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const question = ELECTRICAL_QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = ELECTRICAL_QUIZ_QUESTIONS.length;

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[question.id] !== undefined) return; // Already answered
    setSelectedAnswers(prev => ({
      ...prev,
      [question.id]: optionIndex
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  // Score Calculation
  const correctCount = Object.keys(selectedAnswers).reduce((acc, qId) => {
    const q = ELECTRICAL_QUIZ_QUESTIONS.find(item => item.id === Number(qId));
    if (q && selectedAnswers[Number(qId)] === q.correctIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">
                اختبار وتقييم المعارف الكهربائية والصناعية
              </h2>
              <p className="text-xs text-slate-300">
                أسئلة امتحانية وشهادات اعتماد تغطي معيار NFC 15-100، مخططات التحكم بالمحركات، وأنظمة التأريض.
              </p>
            </div>
          </div>

          <div className="text-left font-mono">
            <span className="text-xs text-slate-400 block">النتيجة الحالية:</span>
            <span className="text-base font-bold text-amber-400">{correctCount} / {totalQuestions}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {!quizFinished ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-xs">
              السؤال {currentIndex + 1} من {totalQuestions}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {question.category === 'nfc15100' ? 'معيار NFC 15-100 السكني' :
               question.category === 'industrial' ? 'الكهرباء الصناعية والمحركات' :
               question.category === 'safety' ? 'السلامة والعزل الكهربائي' : 'الكهروميكانيك'}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {question.questionAr}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {question.optionsAr.map((option, idx) => {
              const isAnswered = selectedAnswers[question.id] !== undefined;
              const isSelected = selectedAnswers[question.id] === idx;
              const isCorrect = question.correctIndex === idx;

              let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (isAnswered) {
                if (isCorrect) {
                  style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  style = 'bg-rose-950/40 border-rose-500 text-rose-200 font-bold';
                } else {
                  style = 'bg-slate-950 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm">{option}</span>
                  </div>

                  {isAnswered && (
                    <div className="shrink-0 mr-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {selectedAnswers[question.id] !== undefined && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 animate-fadeIn text-xs">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  الشرح والتعليل الهندسي:
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {question.standardReference}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {question.explanationAr}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-end pt-3 border-t border-slate-800">
            {selectedAnswers[question.id] !== undefined && (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>{currentIndex < totalQuestions - 1 ? 'السؤال التالي' : 'عرض النتيجة والشهادة'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Final Score & Certificate */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">
              {scorePercent >= 80 ? 'تهانينا! مستوى مهندس متمكن' : scorePercent >= 50 ? 'نتيجة جيدة جداً مع إمكانية التحسين' : 'تحتاج لمراجعة المعايير والمخططات'}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              لقد أجبت بشكل صحيح على {correctCount} من أصل {totalQuestions} أسئلة ({scorePercent}%).
            </p>
          </div>

          {/* Certificate Card */}
          <div className="bg-slate-950 border-2 border-amber-500/50 rounded-2xl p-6 text-center max-w-lg mx-auto shadow-2xl relative overflow-hidden">
            <div className="text-xs uppercase tracking-widest text-slate-400 mb-1 font-mono">
              ElectroPro Certification
            </div>
            <h4 className="text-lg font-bold text-amber-400 mb-2">
              شهادة إتقان المعايير الكهربائية والكهروميكانيكية
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              تشهد المنصة بأن المستخدم أتم بنجاح اختبار معايير NFC 15-100 والتحكم الصناعي بمعدل {scorePercent}%.
            </p>
            <div className="text-[10px] text-slate-500 font-mono">
              معيار المطابقة: NFC 15-100 / IEC 60947 / NF C 18-510
            </div>
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة الاختبار
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
