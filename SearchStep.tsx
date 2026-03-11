
// @ts-ignore
import React, { useState } from 'react';
import { AppState, Character, Chapter } from '../types';
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
  onNext: (storyData: Partial<AppState['story']>, sources: { uri: string; title: string }[]) => void;
  onBack: () => void;
}

const SearchStep: React.FC<Props> = ({ onNext, onBack }) => {
  const [bookName, setBookName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!bookName.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      const { data, sources } = await apiService.searchBookAndExtract(bookName);
      
      // 检查返回数据的完整性
      if (!data || !data.worldView) {
        throw new Error("同步失败：未能获取到核心世界观设定。");
      }

      const charactersWithId = (data.characters || []).map((c: any) => ({
        ...c,
        id: Math.random().toString(36).substr(2, 9)
      }));

      // 处理章节 ID 对齐
      const processedChapters: Chapter[] = (data.latestChapters || []).map((c: any, index: number) => ({
        id: c.id || (index + 1),
        title: c.title || `第${index + 1}章`,
        summary: c.summary || '',
        content: ''
      }));

      onNext({
        title: data.title || bookName,
        worldView: {
          cultivationSystem: data.worldView.cultivationSystem || '',
          geography: data.worldView.geography || '',
          powerLevels: data.worldView.powerLevels || '',
          coreGoldFinger: data.worldView.coreGoldFinger || ''
        },
        characters: charactersWithId,
        plotArc: data.plotArc || '',
        chapters: processedChapters
      }, sources);

    } catch (err: any) {
      console.error(err);
      setError(err.message || '联网检索失败。请确认书名是否正确，或稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-12 bg-white shadow-2xl my-16 rounded-3xl border border-slate-100">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">联网同步书籍信息</h2>
        <p className="text-slate-500 text-sm mt-2">系统将深度穿透各大站库，自动提炼世界观架构、人物小传及最新章节梗概。</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input 
            type="text" 
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="请输入完整书名 (推荐包含作者名)"
            className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-400 focus:bg-white transition-all outline-none font-bold text-slate-700"
            disabled={loading}
          />
          <svg className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-[11px] rounded-xl border border-red-100 animate-pulse">
            <strong>⚠ 同步出错：</strong> {error}
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <button 
            onClick={onBack}
            className="flex-1 py-4 px-6 rounded-2xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition-all"
            disabled={loading}
          >
            返回
          </button>
          <button 
            onClick={handleSearch}
            disabled={loading || !bookName.trim()}
            className={`flex-[2] py-4 px-6 rounded-2xl font-bold transition-all shadow-xl ${loading || !bookName.trim() ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100'}`}
          >
            {loading ? '全网深度索引提炼中...' : '开始同步全网设定'}
          </button>
        </div>

        {loading && (
          <div className="space-y-4 pt-6">
            <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-orange-500 h-full animate-[progress_8s_linear_infinite]" style={{width: '100%'}}></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                <span>穿透各大文学站点...</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                <span>提炼修炼力量体系...</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></div>
                <span>正在重构人物图谱...</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></div>
                <span>对接最新剧情伏笔...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchStep;
