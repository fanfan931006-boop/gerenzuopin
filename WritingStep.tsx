
// @ts-ignore
import React, { useState, useRef } from 'react';
import { AppState, Chapter, AppStep } from '../types';
import { apiService } from './ApiService';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}


interface Props {
  state: AppState;
  updateState: (updater: Partial<AppState> | ((prev: AppState) => AppState)) => void;
}

const WritingStep: React.FC<Props> = ({ state, updateState }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [writing, setWriting] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const currentOutline = state.currentBatchOutlines[currentChapterIndex];
  const activeChapter = state.story.chapters.find(c => c.id === currentOutline?.id);
  
  // 衔接文本逻辑：取上一章的结尾
  const prevChapter = state.story.chapters.find(c => c.id === (currentOutline?.id || 0) - 1);
  const anchorText = prevChapter?.content ? prevChapter.content.slice(-300) : "（前序内容缺失，将作为独立新章开启）";

  const generateChapterText = async () => {
    if (!currentOutline?.id) return;
    setWriting(true);
    try {
      const text = await apiService.writeChapter(state, currentOutline.id, instruction);
      
      const newChapter: Chapter = {
        id: currentOutline.id,
        title: currentOutline.title || `第${currentOutline.id}章`,
        summary: currentOutline.summary || '',
        content: text
      };

      updateState(prev => {
        const existingIndex = prev.story.chapters.findIndex(c => c.id === newChapter.id);
        const newChapters = [...prev.story.chapters];
        if (existingIndex >= 0) newChapters[existingIndex] = newChapter;
        else newChapters.push(newChapter);
        
        return {
          ...prev,
          story: { ...prev.story, chapters: newChapters }
        };
      });
      
      setToastMessage('章节生成成功！');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error(e);
      setToastMessage('生成正文失败，请重试');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setWriting(false);
    }
  };

  const handleCopyContent = () => {
    if (activeChapter?.content) {
      navigator.clipboard.writeText(activeChapter.content);
      setToastMessage('内容已复制到剪贴板');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* 侧边栏：核心设定预览 */}
      <aside className={`${sidebarOpen ? 'w-96' : 'w-0'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden shadow-2xl z-20`}>
        <div className="p-5 border-b bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
          <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300">实时设定观测</h3>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {/* 上一章衔接预览 */}
          <div className="p-5 bg-slate-900 rounded-xl border border-slate-700 shadow-lg">
            <h4 className="text-[10px] font-bold text-blue-400 mb-3 uppercase tracking-widest flex justify-between items-center">
              前序锚点文本
              <span className="text-[8px] bg-blue-900/50 px-2 py-0.5 rounded-full text-blue-300">自动承接</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed italic line-clamp-6">“...{anchorText}”</p>
          </div>

          <div className="p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
            <h4 className="text-[10px] font-bold text-blue-600 mb-3 uppercase tracking-tighter flex items-center space-x-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              战力平衡校验
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">{state.story.worldView.powerLevels || '设定未载入'}</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase px-1 tracking-widest flex items-center space-x-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              角色动态 (前10名)
            </h4>
            {state.story.characters.slice(0, 10).map(c => (
              <div key={c.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-slate-800">{c.name}</span>
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{c.personality}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">{c.skills}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
        {/* 侧边栏切换按钮 */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-slate-200 border-l-0 p-2 rounded-r-xl shadow-lg z-30 hover:bg-slate-100 transition-colors"
        >
          <svg className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* 章节导航条 */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0 z-10 shadow-sm">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setCurrentChapterIndex(Math.max(0, currentChapterIndex - 1))} 
              disabled={currentChapterIndex === 0}
              className="text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">正在开悟：第 {currentOutline?.id} 章</span>
              <h2 className="font-bold text-lg text-slate-800">{currentOutline?.title}</h2>
            </div>
            <button 
              onClick={() => setCurrentChapterIndex(Math.min(state.currentBatchOutlines.length - 1, currentChapterIndex + 1))} 
              disabled={currentChapterIndex === state.currentBatchOutlines.length - 1}
              className="text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {activeChapter?.content && (
              <button 
                onClick={handleCopyContent}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>复制内容</span>
              </button>
            )}
            <button 
              onClick={generateChapterText}
              disabled={writing}
              className={`px-8 py-3 rounded-lg font-bold text-sm shadow-xl transition-all duration-300 ${writing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 active:scale-95'}`}
            >
              {writing ? '神思泉涌中...' : (activeChapter?.content ? '⚡ 重塑剧情' : '✍ 开启本章正文')}
            </button>
          </div>
        </div>

        {/* 正文显示区域 */}
        <div className="flex-1 overflow-y-auto bg-[#fafafa] p-8 md:p-12" ref={scrollRef}>
          <div className="max-w-3xl mx-auto">
            {writing ? (
              <div className="flex flex-col items-center justify-center py-40">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-sm font-bold text-slate-600 tracking-widest animate-pulse">正在穿透原著时空，构建后续剧情...</p>
                <p className="text-xs text-slate-400 mt-3">系统正在深度分析前序内容，确保续写无缝衔接</p>
              </div>
            ) : activeChapter?.content ? (
              <article className="novel-font text-xl leading-[2.4] text-slate-900 whitespace-pre-wrap px-8 md:px-12 py-10 md:py-16 bg-white shadow-2xl rounded-2xl border border-slate-100">
                <h1 className="text-3xl font-bold mb-12 text-center border-b border-slate-200 pb-8 text-slate-800">{activeChapter.title}</h1>
                {activeChapter.content}
              </article>
            ) : (
              <div className="py-48 text-center border-4 border-dashed rounded-3xl border-slate-200 bg-white">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <p className="text-slate-400 font-bold italic">细纲已就绪，点击上方按钮开启“神思”模式</p>
                <p className="text-xs text-slate-300 mt-3 max-w-md mx-auto">系统将自动读取上一章末尾，确保正文无缝衔接，保持文风一致</p>
              </div>
            )}
          </div>
        </div>

        {/* 底部指令区 */}
        <div className="p-5 bg-white border-t border-slate-200 flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 shadow-[0_-4px_6px_rgba(0,0,0,0.02)]">
          <div className="flex-1">
            <div className="relative">
              <input 
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                className="w-full bg-slate-50 p-4 pl-12 rounded-lg text-sm border border-slate-200 focus:bg-white focus:border-blue-300 outline-none transition-all"
                placeholder="对本章创作的密令（例如：增加一些对主角瞳术的特写描写...）"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => updateState({ step: AppStep.OUTLINE_BATCH })}
              className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>修改章节细纲</span>
            </button>
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      {showToast && (
        <div className="fixed bottom-20 right-8 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl animate-slide-up z-50">
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default WritingStep;
