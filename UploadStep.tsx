
// @ts-ignore
import React, { useState } from 'react';
import { AppState, Chapter, Character } from '../types';
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
  onNext: (storyData: Partial<AppState['story']>) => void;
  onSearch: () => void;
}

const UploadStep: React.FC<Props> = ({ onNext, onSearch }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInfo({ name: file.name, size: file.size });
    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      try {
        const analysis = await apiService.analyzeOriginalDoc(text);
        
        const charactersWithId = analysis.characters.map((c: any) => ({
          ...c,
          id: Math.random().toString(36).substr(2, 9)
        }));

        onNext({
          title: file.name.replace('.txt', ''),
          originalDoc: text,
          chapters: analysis.chapters.map((c: any) => ({
            id: c.id,
            title: c.title,
            summary: c.summary,
            content: '' 
          })),
          plotArc: analysis.summary,
          worldView: analysis.worldView,
          characters: charactersWithId
        });
      } catch (err) {
        console.error(err);
        setError('解析文档失败，请检查文件格式或网络连接。');
        setLoading(false);
        setFileInfo(null);
      }
    };
    reader.readAsText(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 my-8 md:my-16 flex flex-col items-center">
      {/* 标题区域 */}
      <div className="text-center mb-12 w-full">
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          第一步：数据录入
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">选择您的创作起点</h2>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
          上传您已有的小说草稿，或通过联网搜索同步已知名著信息，AI 将深度分析并为您续写精彩内容
        </p>
      </div>

      {/* 功能卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* 本地上传 */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center group hover:border-blue-400 transition-all duration-300 hover:shadow-2xl">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 text-blue-600 shadow-lg">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">上传本地稿件</h3>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            支持 .txt 格式。适合已经写了一部分的原创作品，AI 将深度解析文风与架构，确保续写无缝衔接
          </p>
          
          {/* 文件信息显示 */}
          {fileInfo && !loading && (
            <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-green-800">{fileInfo.name}</p>
                <p className="text-xs text-green-600">{formatFileSize(fileInfo.size)}</p>
              </div>
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <label className={`w-full py-4 px-6 rounded-xl text-center cursor-pointer font-bold transition-all duration-300 ${loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}>
            {loading ? '解析中...' : fileInfo ? '重新选择文件' : '选择 TXT 文档'}
            <input 
              type="file" 
              accept=".txt" 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={loading}
            />
          </label>
        </div>

        {/* 联网搜索 */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center group hover:border-orange-400 transition-all duration-300 hover:shadow-2xl">
          <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 text-orange-500 shadow-lg">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">联网搜书同步</h3>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            只需输入书名，AI 将自动从全网同步其最新世界观、人物设定及最新章节走向，为您续写精彩内容
          </p>
          
          <button 
            onClick={onSearch}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg shadow-orange-100"
          >
            开始搜索同步
          </button>
        </div>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="mt-10 w-full max-w-md bg-red-50 border border-red-200 rounded-xl p-4 shadow-md">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="mt-12 w-full max-w-md space-y-5">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <h4 className="font-semibold text-slate-800">正在深度分析文档...</h4>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>提取核心人物</span>
                  <span>✓</span>
                </div>
                <div className="bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-full rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>分析世界观架构</span>
                  <span>✓</span>
                </div>
                <div className="bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-full rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>构建剧情脉络</span>
                  <span>...</span>
                </div>
                <div className="bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-full rounded-full animate-pulse" style={{width: '70%'}}></div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-400 text-center italic">
            系统正在穿透文档逻辑层，为您准备最佳续写方案...
          </p>
        </div>
      )}

      {/* 提示信息 */}
      <div className="mt-12 w-full max-w-3xl bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>小贴士</span>
        </h4>
        <ul className="text-sm text-slate-600 space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold mt-0.5">•</span>
            <span>上传的 TXT 文件建议不超过 10MB，以获得最佳解析速度</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold mt-0.5">•</span>
            <span>对于长篇小说，建议上传最近几章内容，以便 AI 更好地捕捉您的写作风格</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold mt-0.5">•</span>
            <span>联网搜索功能支持大部分热门小说，同步后您可以继续创作或修改原有设定</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UploadStep;
