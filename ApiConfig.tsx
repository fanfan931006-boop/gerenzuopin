// @ts-ignore
import React, { useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface ApiConfigProps {
  onSave: (config: ApiConfig) => void;
  currentConfig: ApiConfig;
}

export interface ApiConfig {
  apiKey: string;
  apiUrl: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
}

const ApiConfig: React.FC<ApiConfigProps> = ({ onSave, currentConfig }) => {
  const [apiKey, setApiKey] = useState(currentConfig.apiKey);
  const [apiUrl, setApiUrl] = useState(currentConfig.apiUrl);
  const [modelName, setModelName] = useState(currentConfig.modelName);
  const [temperature, setTemperature] = useState(currentConfig.temperature.toString());
  const [maxTokens, setMaxTokens] = useState(currentConfig.maxTokens.toString());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = () => {
    const config: ApiConfig = {
      apiKey,
      apiUrl,
      modelName,
      temperature: parseFloat(temperature),
      maxTokens: parseInt(maxTokens)
    };
    
    onSave(config);
    setToastMessage('API配置已保存');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-lg my-8">
      <div className="mb-8">
        <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          API配置
        </div>
        <h2 className="text-2xl font-bold mb-4 text-slate-800">模型API设置</h2>
        <p className="text-slate-600 text-sm">配置您的AI模型API，支持自定义部署的模型服务</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">API密钥</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 outline-none transition-all"
            placeholder="输入您的API密钥"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">API地址</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 outline-none transition-all"
            placeholder="输入API服务地址，例如：https://api.gemini.com/v1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">模型名称</label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 outline-none transition-all"
            placeholder="输入模型名称，例如：gemini-1.5-pro"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">温度参数</label>
            <input
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 outline-none transition-all"
              placeholder="0.7"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">最大令牌数</label>
            <input
              type="number"
              min="1"
              max="100000"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 outline-none transition-all"
              placeholder="4096"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
        >
          保存API配置
        </button>
      </div>

      {/* 提示信息 */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl z-50">
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* 预设模板 */}
      <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">预设模板</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => {
              setApiKey('');
              setApiUrl('https://generativelanguage.googleapis.com/v1');
              setModelName('gemini-1.5-pro');
              setTemperature('0.7');
              setMaxTokens('4096');
            }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Google Gemini
          </button>
          <button
            onClick={() => {
              setApiKey('');
              setApiUrl('https://api.openai.com/v1');
              setModelName('gpt-4o');
              setTemperature('0.7');
              setMaxTokens('4096');
            }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            OpenAI GPT
          </button>
          <button
            onClick={() => {
              setApiKey('');
              setApiUrl('https://api.mistral.ai/v1');
              setModelName('mistral-large-latest');
              setTemperature('0.7');
              setMaxTokens('8192');
            }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Mistral AI
          </button>
          <button
            onClick={() => {
              setApiKey('');
              setApiUrl('http://localhost:11434/api');
              setModelName('llama3');
              setTemperature('0.7');
              setMaxTokens('8192');
            }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Local LLaMA
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiConfig;