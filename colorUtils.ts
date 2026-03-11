// 色彩处理工具函数

/**
 * 将RGB颜色转换为HSB颜色模型
 * @param r 红色通道值 (0-255)
 * @param g 绿色通道值 (0-255)
 * @param b 蓝色通道值 (0-255)
 * @returns HSB颜色对象 {h: 0-360, s: 0-1, b: 0-1}
 */
export const rgbToHsb = (r: number, g: number, b: number): { h: number; s: number; b: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const bVal = max;

  const delta = max - min;

  if (delta > 0) {
    s = delta / max;

    if (r === max) {
      h = ((g - b) / delta) * 60;
    } else if (g === max) {
      h = (2 + (b - r) / delta) * 60;
    } else {
      h = (4 + (r - g) / delta) * 60;
    }

    if (h < 0) {
      h += 360;
    }
  }

  return { h, s, b: bVal };
};

/**
 * 将RGB颜色转换为十六进制颜色代码
 * @param r 红色通道值 (0-255)
 * @param g 绿色通道值 (0-255)
 * @param b 蓝色通道值 (0-255)
 * @returns 十六进制颜色代码 (例如: #ff0000)
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * 从图片中提取主色调
 * @param imageUrl 图片URL
 * @returns Promise<{ rgb: [number, number, number], hex: string, hsb: { h: number, s: number, b: number } }>
 */
export const extractDominantColor = async (imageUrl: string): Promise<{
  rgb: [number, number, number];
  hex: string;
  hsb: { h: number; s: number; b: number };
}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        // 创建Canvas元素
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建Canvas上下文'));
          return;
        }
        
        // 绘制图片到Canvas
        ctx.drawImage(img, 0, 0);
        
        // 获取像素数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 简单的色彩直方图统计
        const colorCounts: Record<string, number> = {};
        
        // 每10个像素采样一次，提高性能
        for (let i = 0; i < data.length; i += 40) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];
          
          // 忽略透明像素
          if (alpha < 128) continue;
          
          const colorKey = `${r},${g},${b}`;
          colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }
        
        // 找到出现次数最多的颜色
        let maxCount = 0;
        let dominantColor: [number, number, number] = [0, 0, 0];
        
        for (const [colorKey, count] of Object.entries(colorCounts)) {
          if (count > maxCount) {
            maxCount = count;
            dominantColor = colorKey.split(',').map(Number) as [number, number, number];
          }
        }
        
        const [r, g, b] = dominantColor;
        const hex = rgbToHex(r, g, b);
        const hsb = rgbToHsb(r, g, b);
        
        resolve({ rgb: dominantColor, hex, hsb });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };
    
    img.src = imageUrl;
  });
};

/**
 * 按色相值对作品进行排序
 * @param works 作品数组
 * @returns 按色相排序后的作品数组
 */
export const sortWorksByHue = <T extends { hsbColor: { h: number } }>(works: T[]): T[] => {
  return [...works].sort((a, b) => a.hsbColor.h - b.hsbColor.h);
};
