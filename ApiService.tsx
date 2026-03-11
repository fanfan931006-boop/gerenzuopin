import { AppState, Chapter, WorldView, Character } from '../types';
import { ApiConfig } from './ApiConfig';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

const SYSTEM_INSTRUCTION = `你是一名顶级网络文学架构师与金牌主编。
核心任务：确保小说续写在【文风】、【逻辑】、【爽点】、【伏笔】四个维度达到神级同步。

创作法则：
1. 【人物图谱】：人物性格必须具有极高的辨识度。对话风格需符合其身份地位，严禁OOC（人设崩坏）。
2. 【爽点调度】：遵循“抑扬顿挫”。每章必须有明确的情绪钩子，小高潮需在3章内有反馈，大高潮需在10章内爆发。
3. 【伏笔埋设】：严禁流水账。每一处描写都应为后续剧情服务。若本章出现新道具/人物，必须在后续细纲中标记其作用。
4. 【设定铁律】：严格遵守修炼等级和金手指限制。主角跨阶战斗必须有合理的爆发逻辑（如燃血、秘宝、意志爆发）。
5. 【去AI化】：禁止使用感悟类虚词。多用动作描写、环境烘托、侧面描写。`;

export class ApiService {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  updateConfig(config: ApiConfig) {
    this.config = config;
  }

  private safeJsonParse(text: string) {
    if (!text) return null;
    try {
      // 强力清洗：移除引文、Markdown标签及非JSON字符
      let cleaned = text.replace(/\[\d+(?:,\s*\d+)*\]/g, ''); 
      const start = Math.min(
        cleaned.indexOf('{') === -1 ? Infinity : cleaned.indexOf('{'),
        cleaned.indexOf('[') === -1 ? Infinity : cleaned.indexOf('[')
      );
      const end = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));
      if (start === Infinity || end === -1) return JSON.parse(cleaned.trim());
      return JSON.parse(cleaned.substring(start, end + 1));
    } catch (e) {
      console.error("Parse Error:", text);
      throw new Error("设定提炼失败：AI输出格式异常。请尝试手动微调设定。");
    }
  }

  private async makeApiRequest(prompt: string, schema?: any) {
    const requestBody = {
      model: this.config.modelName,
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: prompt }
      ],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      response_format: schema ? { type: "json_object" } : undefined
    };

    try {
      const response = await fetch(`${this.config.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("API请求错误:", error);
      throw error;
    }
  }

  async searchBookAndExtract(bookName: string) {
    const prompt = `【全网深度透视】检索小说《${bookName}》。
目标：
1. 【核心设定】：修炼体系、地理版图、当前战力层级。
2. 【人物建模】：提取主角及至少4名关键配角的姓名、性格标签、特有技能及当前关系。
3. 【剧情进度】：最后5章的详细情节，提炼出尚未解决的冲突和伏笔。
4. 【文风分析】：提炼其词藻偏好（如：词语华丽、简练有力、对话流、冷幽默）。

请以JSON格式返回结果，包含以下字段：
- title: 书名
- styleTags: 风格标签
- worldView: 世界观设定（包含cultivationSystem、geography、powerLevels、coreGoldFinger）
- characters: 人物列表（包含name、personality、skills、relationship）
- plotArc: 剧情大纲
- latestChapters: 最新章节（包含id、title、summary）`;

    const response = await this.makeApiRequest(prompt, {
      type: "object",
      properties: {
        title: { type: "string" },
        styleTags: { type: "string" },
        worldView: {
          type: "object",
          properties: {
            cultivationSystem: { type: "string" },
            geography: { type: "string" },
            powerLevels: { type: "string" },
            coreGoldFinger: { type: "string" }
          },
          required: ["cultivationSystem", "geography", "powerLevels", "coreGoldFinger"]
        },
        characters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              personality: { type: "string" },
              skills: { type: "string" },
              relationship: { type: "string" }
            },
            required: ["name", "personality", "skills", "relationship"]
          }
        },
        plotArc: { type: "string" },
        latestChapters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              summary: { type: "string" }
            }
          }
        }
      }
    });

    return {
      data: this.safeJsonParse(response),
      sources: [] // 通用API不支持来源信息
    };
  }

  async analyzeOriginalDoc(text: string) {
    const prompt = `【正文深度解构】阅读以下文本，执行：
1. 提取所有出场人物及其详细信息。
2. 总结当前剧情大纲及冲突点。
3. 提炼世界观（境界、地理、金手指）。
4. 识别当前剧情中【被忽略的伏笔】。

文本内容：\n${text.slice(0, 12000)}

请以JSON格式返回结果，包含以下字段：
- characters: 人物列表（包含name、personality、skills、relationship）
- chapters: 章节列表（包含id、title、summary）
- worldView: 世界观设定（包含cultivationSystem、geography、powerLevels、coreGoldFinger）
- summary: 剧情总结`;

    const response = await this.makeApiRequest(prompt);
    return this.safeJsonParse(response);
  }

  async generateBatchOutline(state: AppState, count: number = 10) {
    // 关键优化：读取最后两章的完整正文作为语境（如果存在）
    const lastChapter = state.story.chapters[state.story.chapters.length - 1];
    const contextContent = lastChapter?.content ? lastChapter.content.slice(-2000) : "无正文，仅参考梗概";
    
    const prompt = `【剧情增量推演】
【世界观约束】：${JSON.stringify(state.story.worldView)}
【人物图谱】：${state.story.characters.map(c => `${c.name}(${c.personality}):${c.skills}`).join('; ')}
【当前主线】：${state.story.plotArc}
【接头正文】："......${contextContent}"

任务：基于以上信息，推演后续${count}章细纲。
要求：
1. 每一章必须包含明确的【爽点(coolPoints)】（如：打脸成功、获得秘宝、突破境界）。
2. 每一章必须包含【伏笔(foreshadowing)】（为3章后的转折做铺垫）。
3. 逻辑承接必须丝滑，严禁出现降智行为。

请以JSON数组格式返回结果，每个元素包含以下字段：
- title: 章节标题
- summary: 章节概要
- coolPoints: 核心爽点
- foreshadowing: 埋下伏笔`;

    const response = await this.makeApiRequest(prompt);
    return this.safeJsonParse(response);
  }

  async writeChapter(state: AppState, chapterId: number, userInstruction?: string) {
    const outline = state.currentBatchOutlines.find(c => c.id === chapterId);
    const prevChapter = state.story.chapters.find(c => c.id === chapterId - 1);
    
    // 强制提取真实的最后 1200 字作为续写锚点
    const anchorText = prevChapter?.content?.slice(-1200) || "（新篇章开启）";
    
    const prompt = `【神笔续写任务】
【锚点前情】：
"......${anchorText}"

【本章细纲】：
- 标题：${outline?.title}
- 情节：${outline?.summary}
- 爽点：${(outline as any).coolPoints}
- 预埋伏笔：${(outline as any).foreshadowing}

【创作约束】：
- 读者画像：${state.profile.readerPersona}
- 模仿文风：${(state.story as any).styleTags || '主流网文风格'}
- 补充密令：${userInstruction || '无'}

请输出本章完整正文（不少于2500字）：`;

    const response = await this.makeApiRequest(prompt);
    return response;
  }

  async supplementWorldBuilding(state: AppState) {
    const prompt = `【架构补全计划】基于当前已有设定，补全逻辑死角（如：货币单位、特定宗门的内斗逻辑、传说级BOSS的弱点等）。
已有的设定：${JSON.stringify(state.story.worldView)}

请以JSON格式返回补全后的世界观设定，包含以下字段：
- cultivationSystem: 修炼体系
- geography: 地理设定
- powerLevels: 战力层级
- coreGoldFinger: 核心金手指`;

    const response = await this.makeApiRequest(prompt);
    return this.safeJsonParse(response);
  }
}

// 默认API配置
export const defaultApiConfig: ApiConfig = {
  apiKey: '',
  apiUrl: 'https://generativelanguage.googleapis.com/v1',
  modelName: 'gemini-1.5-pro',
  temperature: 0.7,
  maxTokens: 4096
};

// 导出单例
export let apiService: ApiService;

export const initApiService = (config: ApiConfig = defaultApiConfig) => {
  apiService = new ApiService(config);
  return apiService;
};
