
// @ts-ignore
import React, { useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

import { AppState, GenreType, StoryLength } from '../types';

interface Props {
  state: AppState;
  onNext: (profile: AppState['profile']) => void;
}

const SetupStep: React.FC<Props> = ({ state, onNext }) => {
  const [genres, setGenres] = useState<GenreType[]>(state.profile.genres);
  const [length, setLength] = useState<StoryLength>(state.profile.length);
  const [persona, setPersona] = useState(state.profile.readerPersona);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const toggleGenre = (genre: GenreType) => {
    setGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleNext = () => {
    // 验证表单
    if (!persona.trim()) {
      setToastMessage('请填写读者画像设定');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    if (genres.length === 0) {
      setToastMessage('请至少选择一个爽点偏好');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    onNext({ genres, length, readerPersona: persona });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-12">
      <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white shadow-xl rounded-lg">
        {/* 标题区域 */}
        <div className="mb-8">
          <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            第一步：风格设定
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800">用户画像与篇幅设定</h2>
          <p className="text-slate-600 text-sm">请设置您的创作偏好，系统将根据这些信息为您生成最适合的续写内容</p>
        </div>
        
        <div className="space-y-8">
          <section>
            <label className="block text-sm font-semibold text-slate-700 mb-3">读者画像设定</label>
            <textarea 
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none h-32 transition-all"
              placeholder="例如：男性为主，年龄跨度大，追求文笔细腻、打斗画面感..."
            />
          </section>

          <section>
            <label className="block text-sm font-semibold text-slate-700 mb-3">爽点偏好趋势 (多选)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(GenreType).map(g => (
                <label key={g} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-300 ${genres.includes(g) ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400' : 'hover:bg-slate-50'}`}>
                  <input 
                    type="checkbox" 
                    checked={genres.includes(g)} 
                    onChange={() => toggleGenre(g)}
                    className="mr-3 h-4 w-4 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-slate-700 leading-relaxed">{g}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-sm font-semibold text-slate-700 mb-3">篇幅规划 (单选)</label>
            <div className="space-y-3">
              {Object.values(StoryLength).map(l => (
                <label key={l} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${length === l ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400' : 'hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="length"
                    checked={length === l} 
                    onChange={() => setLength(l)}
                    className="mr-3 h-4 w-4 flex-shrink-0"
                  />
                  <span className="text-sm text-slate-700">{l}</span>
                </label>
              ))}
            </div>
          </section>

          <button 
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-200"
          >
            确认选择并开始构建
          </button>
        </div>
      </div>

      {/* 提示信息 */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl z-50">
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default SetupStep;
