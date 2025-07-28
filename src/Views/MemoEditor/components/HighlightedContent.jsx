import React, { useEffect, useRef } from 'react';
import './HighlightedContent.css';

const HighlightedContent = ({
  content,
  highlightedContent,
  isVoiceEditing,
  tooltips,
  onHighlightedTextClick,
  onTooltipClick
}) => {
  const contentDisplayRef = useRef(null);

  // Обработчик скролла и обновление позиций всплывающих элементов
  useEffect(() => {
    const updateTooltipPositions = () => {
      if (contentDisplayRef.current && isVoiceEditing) {
        const container = contentDisplayRef.current;
        const highlightedElements = container.querySelectorAll('.highlighted-text');
        const visibleTooltips = [];
        
        highlightedElements.forEach(element => {
          const elementRect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Проверяем, виден ли элемент в контейнере
          const isVisible = elementRect.top >= containerRect.top && 
                           elementRect.bottom <= containerRect.bottom;
          
          if (isVisible) {
            // Добавляем tooltip для видимого элемента
            const replacement = element.dataset.replacement;
            const position = element.dataset.position;
            const x = elementRect.left + elementRect.width / 2;
            // Смещаем выше элемента с учетом высоты tooltip
            const y = elementRect.top - 50;
            
            visibleTooltips.push({
              x,
              y,
              text: replacement,
              position,
              visible: true
            });
          }
        });
        
        // Обновляем tooltips через callback
        if (typeof onTooltipClick === 'function') {
          onTooltipClick(visibleTooltips);
        }
      }
    };

    const container = contentDisplayRef.current;
    if (container) {
      container.addEventListener('scroll', updateTooltipPositions);
      window.addEventListener('resize', updateTooltipPositions);
      window.addEventListener('scroll', updateTooltipPositions);
      
      // Вызываем сразу для проверки начального состояния
      updateTooltipPositions();
      
      return () => {
        container.removeEventListener('scroll', updateTooltipPositions);
        window.removeEventListener('resize', updateTooltipPositions);
        window.removeEventListener('scroll', updateTooltipPositions);
      };
    }
  }, [highlightedContent, isVoiceEditing, onTooltipClick]);

  if (isVoiceEditing) {
    return (
      <div className="highlighted-content">
        <div 
          ref={contentDisplayRef}
          className="highlighted-content__display"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
          onClick={(e) => {
            if (e.target.classList.contains('highlighted-text')) {
              const position = e.target.dataset.position;
              const replacement = e.target.dataset.replacement;
              onHighlightedTextClick(position, replacement);
            }
          }}
        />
        {tooltips.map((tooltip, index) => (
          <div 
            key={`${tooltip.position}-${index}`}
            className="highlighted-content__tooltip"
            style={{
              position: 'fixed',
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translateX(-50%)',
              zIndex: 1001
            }}
            onClick={() => onHighlightedTextClick(tooltip.position, tooltip.text)}
          >
            {tooltip.text}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default HighlightedContent; 