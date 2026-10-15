import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { CableCalculator } from './components/CableCalculator';
import { CircuitSimulatorLab } from './components/CircuitSimulatorLab';
import { CircuitsLibrary } from './components/CircuitsLibrary';
import { StandardsSearchLibrary } from './components/StandardsSearchLibrary';
import { NfcGuide } from './components/NfcGuide';
import { MotorStarterSimulator } from './components/MotorStarterSimulator';
import { IndustrialCalculators } from './components/IndustrialCalculators';
import { EarthingSystems } from './components/EarthingSystems';
import { SymbolsGlossary } from './components/SymbolsGlossary';
import { FormulasAndTables } from './components/FormulasAndTables';
import { TroubleshootingTree } from './components/TroubleshootingTree';
import { StudentQuiz } from './components/StudentQuiz';
import { ExportModal } from './components/ExportModal';
import { Zap, Heart, ShieldCheck, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cables');
  const [showFrenchTerms, setShowFrenchTerms] = useState<boolean>(true);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [savedReports, setSavedReports] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('electropro_saved_reports');
      return stored ? JSON.parse(stored) : [
        {
          title: 'دارة تغذية صفيحة طهي كهربائية 7kW (32A)',
          result: {
            standardSectionMm2: 6.0,
            designCurrentIb: 30.4,
            actualVoltageDropPercent: 1.85,
            actualVoltageDropV: 4.25,
            recommendedBreakerA: 32,
            breakerCurve: 'C',
            minConduitDiameterIctaMm: 25
          }
        }
      ];
    } catch {
      return [];
    }
  });

  const handleSaveToReport = (reportItem: any) => {
    setSavedReports(prev => {
      const updated = [reportItem, ...prev];
      try {
        localStorage.setItem('electropro_saved_reports', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showFrenchTerms={showFrenchTerms}
        setShowFrenchTerms={setShowFrenchTerms}
        onOpenReport={() => setIsExportOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'cables' && (
          <CableCalculator
            showFrenchTerms={showFrenchTerms}
            onSaveToReport={handleSaveToReport}
          />
        )}

        {activeTab === 'circuit_lab' && (
          <CircuitSimulatorLab
            showFrenchTerms={showFrenchTerms}
          />
        )}

        {activeTab === 'circuits' && (
          <CircuitsLibrary
            showFrenchTerms={showFrenchTerms}
          />
        )}

        {activeTab === 'standards_library' && (
          <StandardsSearchLibrary
            showFrenchTerms={showFrenchTerms}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'nfc' && (
          <NfcGuide
            showFrenchTerms={showFrenchTerms}
          />
        )}

        {activeTab === 'motor_simulator' && (
          <MotorStarterSimulator
            showFrenchTerms={showFrenchTerms}
          />
        )}

        {activeTab === 'industrial_calc' && (
          <IndustrialCalculators
            showFrenchTerms={showFrenchTerms}
          />
        )}

        {activeTab === 'earthing' && (
          <EarthingSystems
            showFrenchTerms={showFrenchTerms}
          />
        )}

        {activeTab === 'symbols' && (
          <SymbolsGlossary
            showFrenchTerms={showFrenchTerms}
          />
        )}

        {activeTab === 'formulas' && (
          <FormulasAndTables
            showFrenchTerms={showFrenchTerms}
          />
        )}

        {activeTab === 'troubleshooting' && (
          <TroubleshootingTree
            showFrenchTerms={showFrenchTerms}
          />
        )}

        {activeTab === 'quiz' && (
          <StudentQuiz
            showFrenchTerms={showFrenchTerms}
          />
        )}
      </main>

      {/* Professional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-400 font-semibold">
              ElectroPro - المنصة الهندسية المتكاملة للكهرباء المعمارية والصناعية والكهروميكانيك
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>NFC 15-100</span>
            <span>•</span>
            <span>IEC 60364</span>
            <span>•</span>
            <span>NF C 18-510</span>
            <span>•</span>
            <span>IEC 60947</span>
          </div>
        </div>
      </footer>

      {/* Export / Print Calculation Sheet Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        savedItems={savedReports}
      />
    </div>
  );
}
