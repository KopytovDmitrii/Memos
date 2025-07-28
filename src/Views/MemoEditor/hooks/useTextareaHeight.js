import { useEffect, useCallback } from 'react';

export const useTextareaHeight = (textareaRef, content) => {
  const adjustTextareaHeight = useCallback((textarea) => {
    if (!textarea) return;
    
    // Создаем временный элемент для точного расчета
    const temp = document.createElement('div');
    temp.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: ${textarea.offsetWidth}px;
      font-family: ${getComputedStyle(textarea).fontFamily};
      font-size: ${getComputedStyle(textarea).fontSize};
      line-height: ${getComputedStyle(textarea).lineHeight};
      padding: ${getComputedStyle(textarea).padding};
      border: ${getComputedStyle(textarea).border};
      box-sizing: border-box;
      white-space: pre-wrap;
      word-wrap: break-word;
    `;
    temp.textContent = textarea.value;
    
    document.body.appendChild(temp);
    const height = Math.max(temp.offsetHeight, 400);
    document.body.removeChild(temp);
    
    textarea.style.height = height + 'px';
    
    // Также обновляем высоту родительского контейнера
    const container = textarea.closest('.memo-editor__content');
    if (container) {
      container.style.minHeight = height + 'px';
    }
  }, []);

  // Устанавливаем правильную высоту textarea при изменении контента
  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [content, adjustTextareaHeight]);

  return { adjustTextareaHeight };
}; 