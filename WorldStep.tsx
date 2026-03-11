
// @ts-ignore
import React, { useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

import { AppState, WorldView, Character } from '../types';
import { apiService } from './ApiService';

interface Props {
  state: AppState;
  onNext: (worldData: Partial<AppState['story']>) => void;
}

const WorldStep: React.FC<Props> = ({ state, onNext }) => {
  const [worldView, setWorldView] = useState<WorldView>(state.story.worldView);
  const [characters, setCharacters] = useState<Character[]>(state.story.characters);
  const [isSupplementing, setIsSupplementing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const addCharacter = () => {
    const newChar: Character = {
      id: Math.random().toString(36).substr(2, 9),
      name: '新人物',
      personality: '',
      skills: '',
      relationship: ''
    };
    setCharacters([...characters, newChar]);
    
    setToastMessage('成功添加新人物');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const updateCharacter = (id: string, field: keyof Character, value: string) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCharacter = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
    
    setToastMessage('成功移除人物');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSupplement = async () => {
    setIsSupplementing(true);
    try {
      const supplemented = await apiService.supplementWorldBuilding({
        ...state,
        story: { ...state.story, worldView, characters }
      });
      setWorldView(supplemented);
      
      setToastMessage('世界观补完成功！');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error(e);
      setToastMessage('补完失败，请检查网络连接后重试');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSupplementing(false);
    }
  };

  const handleNext = () => {
    // 验证世界观设定是否完整
    if (!worldView.powerLevels || !worldView.geography || !worldView.cultivationSystem || !worldView.coreGoldFinger) {
      setToastMessage('请完善世界观的所有核心设定');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    if (characters.length === 0) {
      setToastMessage('请至少添加一个人物');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    onNext({ worldView, characters });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8 pb-24">
      {/* 标题区域 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6">
        <div className="mb-6 md:mb-0">
          <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            第四步：架构补全
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center">
             {state.searchSources ? '✨ 自动架构建模' : '世界观与大纲重构'}
             {state.searchSources && <span className="ml-3 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">设定已从全网同步</span>}
          </h2>
          <p className="text-slate-600 mt-2">
            {state.searchSources ? `系统已深度解构全网资料，自动生成了人物卡与战力体系。` : '基于已有文档生成的骨架，可在此进行深度定制。'}
          </p>
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <button 
            onClick={handleSupplement}
            disabled={isSupplementing}
            className={`px-6 py-3 rounded-lg font-bold border-2 transition-all duration-300 flex-1 md:flex-none ${isSupplementing ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed' : 'border-blue-500 text-blue-600 hover:bg-blue-50'}`}
          >
            {isSupplementing ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                <span>正在逻辑演算...</span>
              </>
            ) : (
              '✨ 智能补全死角'
            )}
          </button>
          <button 
            onClick={handleNext}
            className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-3 rounded-lg font-bold hover:from-slate-800 hover:to-slate-700 transition-all duration-300 shadow-xl flex-1 md:flex-none"
          >
            确认设定并开始推演
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
              <h3 className="text-xs font-bold mb-4 flex items-center text-blue-600 uppercase tracking-wider">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                力量等级/战力体系
              </h3>
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-lg h-40 focus:ring-2 focus:ring-blue-300 text-sm leading-relaxed novel-font border border-slate-200 focus:border-blue-300 outline-none transition-all"
                value={worldView.powerLevels}
                onChange={e => setWorldView({...worldView, powerLevels: e.target.value})}
                placeholder="描述世界中的力量等级体系，如修炼境界、战力划分等"
              />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
              <h3 className="text-xs font-bold mb-4 flex items-center text-purple-600 uppercase tracking-wider">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                地理架构/地图分布
              </h3>
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-lg h-40 focus:ring-2 focus:ring-purple-300 text-sm leading-relaxed novel-font border border-slate-200 focus:border-purple-300 outline-none transition-all"
                value={worldView.geography}
                onChange={e => setWorldView({...worldView, geography: e.target.value})}
                placeholder="描述世界的地理结构，如大陆分布、重要地点等"
              />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
              <h3 className="text-xs font-bold mb-4 flex items-center text-red-600 uppercase tracking-wider">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                修炼核心逻辑
              </h3>
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-lg h-32 focus:ring-2 focus:ring-red-300 text-sm leading-relaxed novel-font border border-slate-200 focus:border-red-300 outline-none transition-all"
                value={worldView.cultivationSystem}
                onChange={e => setWorldView({...worldView, cultivationSystem: e.target.value})}
                placeholder="描述修炼的核心原理和方法"
              />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
              <h3 className="text-xs font-bold mb-4 flex items-center text-orange-600 uppercase tracking-wider">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                核心金手指详情
              </h3>
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-lg h-32 focus:ring-2 focus:ring-orange-300 text-sm leading-relaxed novel-font border border-slate-200 focus:border-orange-300 outline-none transition-all"
                value={worldView.coreGoldFinger}
                onChange={e => setWorldView({...worldView, coreGoldFinger: e.target.value})}
                placeholder="描述主角的核心金手指或特殊能力"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">自动生成的英雄榜</h3>
            <button onClick={addCharacter} className="text-blue-500 text-[10px] font-bold hover:text-blue-700 transition-colors flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>额外录入</span>
            </button>
          </div>
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {characters.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center">
                <p className="text-slate-400 text-sm">暂无人物设定</p>
                <p className="text-slate-300 text-xs mt-1">点击上方按钮添加人物</p>
              </div>
            ) : (
              characters.map(char => (
                <div key={char.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:shadow-md transition-all">
                  <input 
                    className="font-bold text-slate-800 text-base p-0 border-b border-slate-200 w-full focus:border-blue-400 outline-none mb-3 pb-1"
                    value={char.name}
                    onChange={e => updateCharacter(char.id, 'name', e.target.value)}
                    placeholder="人物名称"
                  />
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">性格</span>
                      <input 
                        className="text-xs text-slate-600 flex-1 border-b border-slate-200 focus:border-blue-400 outline-none p-0"
                        value={char.personality}
                        onChange={e => updateCharacter(char.id, 'personality', e.target.value)}
                        placeholder="人物性格特点"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 mb-1">能力/伏笔</span>
                      <textarea 
                        className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 focus:border-blue-300 focus:outline-none h-16 resize-none"
                        value={char.skills}
                        onChange={e => updateCharacter(char.id, 'skills', e.target.value)}
                        placeholder="人物的特殊能力或相关伏笔"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => removeCharacter(char.id)}
                    className="mt-3 text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 p-1 rounded"
                  >
                    移除该角色
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      {showToast && (
        <div className={`fixed bottom-20 right-8 ${toastType === 'success' ? 'bg-green-900' : toastType === 'error' ? 'bg-red-900' : 'bg-slate-900'} text-white px-6 py-3 rounded-lg shadow-2xl z-50`}>
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default WorldStep;
