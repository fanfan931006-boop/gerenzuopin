
// @ts-ignore
import React, { useState } from 'react';
import { AppState, Chapter } from '../types';
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
  onNext: (outlines: Partial<Chapter>[]) => void;
}

const OutlineStep: React.FC<Props> = ({ state, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [outlines, setOutlines] = useState<Partial<Chapter>[]>(state.currentBatchOutlines);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await apiService.generateBatchOutline(state, 10);
      const existingIds = state.story.chapters.map(c => c.id);
      const currentBatchIds = outlines.map(o => o.id || 0);
      const maxId = Math.max(0, ...existingIds, ...currentBatchIds);
      
      const indexedData = data.map((d: any, i: number) => ({
        ...d,
        id: maxId + i + 1
      }));
      setOutlines([...outlines, ...indexedData]);
      
      setToastMessage(`成功生成 ${indexedData.length} 章高能细纲！`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error(e);
      setToastMessage('AI 剧情推演失败，请检查网络后重试');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newOutlines = [...outlines];
    const [movedOutline] = newOutlines.splice(fromIndex, 1);
    newOutlines.splice(toIndex, 0, movedOutline);
    setOutlines(newOutlines);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 flex flex-col h-full overflow-hidden">
      {/* 标题区域 */}
      <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-3xl shadow-sm border border-orange-100">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-14 h-14 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-orange-200">
            {outlines.length}
          </div>
          <div>
            <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              第五步：章节推演
            </div>
            <h2 className="text-2xl font-bold text-slate-800">章节爽点推演</h2>
            <p className="text-slate-600 text-sm">AI已接手正文语境，正在规划高燃剧情与长期伏笔，确保故事节奏紧凑有致</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 bg-white border-2 border-orange-500 text-orange-600 rounded-lg font-bold text-sm hover:bg-orange-50 transition-all duration-300 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                <span>正在构思高燃剧情...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>✨ 续写 10 章高能细纲</span>
              </>
            )}
          </button>
          {outlines.length > 0 && (
            <button 
              onClick={() => onNext(outlines)}
              className="px-8 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg font-bold text-sm shadow-xl hover:from-slate-800 hover:to-slate-700 transition-all duration-300"
            >
              确认并进入正文开悟
            </button>
          )}
        </div>
      </div>

      {/* 大纲列表 */}
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-10">
        {outlines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">暂无章节细纲</h3>
            <p className="text-slate-500 text-center max-w-md">点击上方按钮生成章节细纲，AI将为您规划高燃剧情与长期伏笔</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {outlines.map((outline, index) => (
              <div key={outline.id} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 border-t-8 border-t-orange-400 group">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-orange-50 text-orange-600 text-[10px] px-3 py-1 rounded-full font-bold">第 {outline.id} 章</span>
                  <div className="flex items-center space-x-2">
                    {index > 0 && (
                      <button 
                        onClick={() => handleReorder(index, index - 1)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                    )}
                    {index < outlines.length - 1 && (
                      <button 
                        onClick={() => handleReorder(index, index + 1)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                    <button 
                      onClick={() => setOutlines(prev => prev.filter(o => o.id !== outline.id))}
                      className="text-slate-400 hover:text-red-500 transition-colors group-hover:bg-red-50 p-1.5 rounded-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <input 
                  className="font-bold text-slate-800 bg-transparent border-b border-slate-200 focus:border-orange-500 focus:outline-none w-full mb-4 text-lg py-2 transition-colors"
                  value={outline.title}
                  onChange={e => setOutlines(prev => prev.map(o => o.id === outline.id ? {...o, title: e.target.value} : o))}
                  placeholder="输入章节标题"
                />
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed resize-none h-36 border border-slate-200 focus:border-orange-300 focus:outline-none transition-colors"
                  value={outline.summary}
                  onChange={e => setOutlines(prev => prev.map(o => o.id === outline.id ? {...o, summary: e.target.value} : o))}
                  placeholder="输入章节概要，描述本章的主要内容和情节发展"
                />
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200 hover:border-red-300 transition-colors">
                    <span className="text-[10px] font-bold text-red-600 block mb-2 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      🔥 核心爽点
                    </span>
                    <textarea 
                      className="bg-transparent w-full text-sm text-slate-700 focus:outline-none resize-none h-20"
                      value={(outline as any).coolPoints}
                      onChange={e => setOutlines(prev => prev.map(o => o.id === outline.id ? {...o, coolPoints: e.target.value} : o))}
                      placeholder="描述本章的核心爽点，如主角逆袭、打脸反派等"
                    />
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-colors">
                    <span className="text-[10px] font-bold text-indigo-600 block mb-2 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      🔗 埋下伏笔
                    </span>
                    <textarea 
                      className="bg-transparent w-full text-sm text-slate-700 focus:outline-none resize-none h-20"
                      value={(outline as any).foreshadowing}
                      onChange={e => setOutlines(prev => prev.map(o => o.id === outline.id ? {...o, foreshadowing: e.target.value} : o))}
                      placeholder="描述本章为后续剧情埋下的伏笔，如人物线索、事件预兆等"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>创作提示</span>
        </h4>
        <ul className="text-sm text-slate-600 space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-orange-500 font-bold mt-0.5">•</span>
            <span>章节标题应简洁明了，突出本章核心内容或爽点</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-orange-500 font-bold mt-0.5">•</span>
            <span>核心爽点是吸引读者的关键，应详细描述主角的高光时刻</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-orange-500 font-bold mt-0.5">•</span>
            <span>埋下伏笔有助于构建长期剧情，让故事更有层次感和连贯性</span>
          </li>
        </ul>
      </div>

      {/* 提示信息 */}
      {showToast && (
        <div className="fixed bottom-20 right-8 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl z-50">
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default OutlineStep;
