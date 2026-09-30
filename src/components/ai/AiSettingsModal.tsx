import React, { useState, useEffect } from 'react';
import { X, Key, Sparkles, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { LlmConfig, LlmProvider } from '../../types/llm';
import { getLlmConfig, saveLlmConfig, testLlmConnection } from '../../engine/llmService';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (config: LlmConfig) => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [config, setConfig] = useState<LlmConfig>(getLlmConfig);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(getLlmConfig());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (provider: LlmProvider) => {
    if (provider === 'gemini') {
      setConfig((prev) => ({
        ...prev,
        provider: 'gemini',
        model: 'gemini-2.0-flash-lite',
      }));
    } else if (provider === 'openrouter') {
      setConfig((prev) => ({
        ...prev,
        provider: 'openrouter',
        model: 'qwen/qwen-2.5-72b-instruct',
        customEndpoint: 'https://openrouter.ai/api/v1',
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        provider: 'custom',
        model: 'qwen2.5:latest',
        customEndpoint: 'http://localhost:11434/v1',
      }));
    }
  };

  const handleSave = () => {
    saveLlmConfig(config);
    if (onSaved) onSaved(config);
    onClose();
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testLlmConnection(config);
    setTestResult(res);
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                AI Model & API Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Powers instant Telugu lookups and the AI Practice Arena
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto no-scrollbar flex-1">
          {/* Provider Selector Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select AI Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleProviderChange('gemini')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  config.provider === 'gemini'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">Google Gemini</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  100% Free Tier ★
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('openrouter')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  config.provider === 'openrouter'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">OpenRouter</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Qwen 2.5 / 3.6</div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('custom')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  config.provider === 'custom'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">Local / Custom</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Ollama / LocalAI</div>
              </button>
            </div>
          </div>

          {/* Guide / Recommendation Callout */}
          {config.provider === 'gemini' ? (
            <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Recommended: Gemini Flash-Lite is 100% Free</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Google provides 15 requests/minute & 1,500 requests/day completely free without entering a credit card. It supports Roman Telugu transliterations exceptionally well.
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-300 font-bold underline hover:text-emerald-800"
              >
                <span>Get a free Google Gemini API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                Using Qwen via OpenRouter or Local Ollama
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                Enter your OpenRouter key or point to a local Ollama instance running on your machine (e.g. <code>http://localhost:11434/v1</code>).
              </p>
            </div>
          )}

          {/* API Key Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {config.provider === 'gemini' ? 'Gemini API Key' : 'API Key (or token)'}
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder={config.provider === 'gemini' ? 'AIzaSy...' : 'sk-or-v1-...'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Model Name Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Model Identifier
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              placeholder={
                config.provider === 'gemini'
                  ? 'gemini-2.0-flash-lite'
                  : 'qwen/qwen-2.5-72b-instruct'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {config.provider === 'gemini'
                ? 'Defaults to "gemini-2.0-flash-lite" (or "gemini-1.5-flash")'
                : 'e.g. "qwen/qwen-2.5-72b-instruct" or local model tag'}
            </p>
          </div>

          {/* Custom Endpoint Input (if OpenRouter/Custom) */}
          {config.provider !== 'gemini' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                API Base URL
              </label>
              <input
                type="text"
                value={config.customEndpoint || ''}
                onChange={(e) => setConfig({ ...config, customEndpoint: e.target.value })}
                placeholder="https://openrouter.ai/api/v1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start space-x-2 ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            type="button"
            disabled={!config.apiKey.trim() || isTesting}
            onClick={handleTest}
            className="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-40 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
