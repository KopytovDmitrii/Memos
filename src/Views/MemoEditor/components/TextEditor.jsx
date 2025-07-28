import React, { useState, useEffect, useRef } from 'react';
import './TextEditor.css';
import { useTextareaHeight } from '../hooks/useTextareaHeight';

const TextEditor = ({ 
  value, 
  onChange, 
  onVoiceEdit, 
  isVoiceEditing, 
  voiceEditResult,
  placeholder = "Введите текст заметки..."
}) => {
  const textareaRef = useRef(null);
  const [diffResult, setDiffResult] = useState(null);
  const { adjustTextareaHeight } = useTextareaHeight(textareaRef, value);

  useEffect(() => {
    if (voiceEditResult && voiceEditResult.editedText) {
      const diff = calculateDiff(value, voiceEditResult.editedText);
      setDiffResult(diff);
    }
  }, [voiceEditResult, value]);

  // Обновляем высоту textarea при изменении значения
  useEffect(() => {
    if (textareaRef.current && !isVoiceEditing) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [value, isVoiceEditing, adjustTextareaHeight]);

  const calculateDiff = (originalText, newText) => {
    // Улучшенный алгоритм diff на основе слов
    const changes = [];
    
    // Разбиваем на слова, сохраняя разделители
    const originalWords = originalText.split(/(\s+)/);
    const newWords = newText.split(/(\s+)/);
    
    let i = 0, j = 0;
    
    while (i < originalWords.length || j < newWords.length) {
      // Ищем следующую общую последовательность
      let commonLength = 0;
      while (i + commonLength < originalWords.length && 
             j + commonLength < newWords.length && 
             originalWords[i + commonLength] === newWords[j + commonLength]) {
        commonLength++;
      }
      
      if (commonLength > 0) {
        // Добавляем неизмененную часть
        const unchangedText = originalWords.slice(i, i + commonLength).join('');
        changes.push({
          type: 'unchanged',
          text: unchangedText
        });
        i += commonLength;
        j += commonLength;
      } else {
        // Найдено различие - ищем следующую общую последовательность
        let bestMatch = { length: 0, iOffset: 0, jOffset: 0 };
        
        // Ищем лучшее совпадение в пределах окна
        const searchWindow = 10;
        for (let iOffset = 1; iOffset <= Math.min(searchWindow, originalWords.length - i); iOffset++) {
          for (let jOffset = 1; jOffset <= Math.min(searchWindow, newWords.length - j); jOffset++) {
            let matchLength = 0;
            while (i + iOffset + matchLength < originalWords.length && 
                   j + jOffset + matchLength < newWords.length && 
                   originalWords[i + iOffset + matchLength] === newWords[j + jOffset + matchLength]) {
              matchLength++;
            }
            
            if (matchLength > bestMatch.length) {
              bestMatch = { length: matchLength, iOffset, jOffset };
            }
          }
        }
        
        // Если нашли хорошее совпадение, добавляем изменения до него
        if (bestMatch.length > 0) {
          // Добавляем удаленные слова
          const deletedWords = originalWords.slice(i, i + bestMatch.iOffset);
          if (deletedWords.length > 0) {
            changes.push({
              type: 'changed',
              deleted: deletedWords.join(''),
              added: ''
            });
          }
          
          // Добавляем добавленные слова
          const addedWords = newWords.slice(j, j + bestMatch.jOffset);
          if (addedWords.length > 0) {
            changes.push({
              type: 'changed',
              deleted: '',
              added: addedWords.join('')
            });
          }
          
          i += bestMatch.iOffset;
          j += bestMatch.jOffset;
        } else {
          // Простое изменение одного слова
          const deleted = originalWords[i] || '';
          const added = newWords[j] || '';
          
          if (deleted || added) {
            changes.push({
              type: 'changed',
              deleted,
              added
            });
          }
          
          i++;
          j++;
        }
      }
    }
    
    return changes;
  };



  const renderHighlightedText = (text, isOriginal = true) => {
    if (!diffResult) return text;
    
    let result = '';
    
    diffResult.forEach((change) => {
      if (change.type === 'unchanged') {
        result += change.text;
      } else if (change.type === 'changed') {
        if (isOriginal) {
          // В оригинальном тексте показываем удаленные символы
          if (change.deleted && change.deleted.trim()) {
            result += `<span class="deleted-text">${change.deleted}</span>`;
          }
        } else {
          // В новом тексте показываем добавленные символы
          if (change.added && change.added.trim()) {
            result += `<span class="added-text">${change.added}</span>`;
          }
        }
      }
    });
    
    return result;
  };

  return (
    <div className="text-editor">
      {!isVoiceEditing || !voiceEditResult ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            adjustTextareaHeight(e.target);
          }}
          placeholder={placeholder}
          className="text-editor-textarea"
        />
      ) : (
        <div className="text-editor-diff">
          <div className="text-editor-original">
            <h4>Исходный текст:</h4>
            <div 
              className="highlighted-content"
              dangerouslySetInnerHTML={{ 
                __html: renderHighlightedText(value, true) 
              }}
            />
          </div>
          <div className="text-editor-new">
            <h4>Новый текст:</h4>
            <div 
              className="highlighted-content"
              dangerouslySetInnerHTML={{ 
                __html: renderHighlightedText(voiceEditResult.editedText, false) 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor; 