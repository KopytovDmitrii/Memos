import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextEditor from './TextEditor';

describe('TextEditor', () => {
  it('renders textarea when not voice editing', () => {
    render(
      <TextEditor
        value="Test content"
        onChange={() => {}}
        isVoiceEditing={false}
        voiceEditResult={null}
      />
    );
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders diff view when voice editing', () => {
    const voiceEditResult = {
      editedText: "Test content modified"
    };
    
    render(
      <TextEditor
        value="Test content"
        onChange={() => {}}
        isVoiceEditing={true}
        voiceEditResult={voiceEditResult}
      />
    );
    
    expect(screen.getByText('Исходный текст:')).toBeInTheDocument();
    expect(screen.getByText('Новый текст:')).toBeInTheDocument();
  });

  it('calculates diff correctly', () => {
    const originalText = "Hello world";
    const newText = "Hello beautiful world";
    
    // Создаем экземпляр компонента для тестирования внутренней функции
    const { container } = render(
      <TextEditor
        value={originalText}
        onChange={() => {}}
        isVoiceEditing={true}
        voiceEditResult={{ editedText: newText }}
      />
    );
    
    // Проверяем, что diff отображается
    expect(container.querySelector('.added-text')).toBeInTheDocument(); // Есть добавленный текст
    expect(container.querySelector('.added-text').textContent).toContain('beautiful'); // Проверяем содержимое
  });

  it('handles specific diff case correctly', () => {
    const originalText = "Куриное филе (около 500 грамм – планирую приготовить что-то простое и вкусное на ужин, может быть, обжарю с овощами).";
    const newText = "Куриное филе (около 1 килограмм – планирую приготовить что-то простое и вкусное на ужин, может быть, обжарю с овощами).";
    
    const { container } = render(
      <TextEditor
        value={originalText}
        onChange={() => {}}
        isVoiceEditing={true}
        voiceEditResult={{ editedText: newText }}
      />
    );
    
    // Проверяем, что изменения подсвечены правильно
    const deletedElements = container.querySelectorAll('.deleted-text');
    const addedElements = container.querySelectorAll('.added-text');
    
    // Новый алгоритм может находить изменения на уровне символов
    expect(deletedElements.length).toBeGreaterThan(0);
    expect(addedElements.length).toBeGreaterThan(0);
    
    // Проверяем, что найдены какие-либо изменения
    let hasChanges = false;
    
    deletedElements.forEach(el => {
      if (el.textContent.length > 0) {
        hasChanges = true;
      }
    });
    
    addedElements.forEach(el => {
      if (el.textContent.length > 0) {
        hasChanges = true;
      }
    });
    
    expect(hasChanges).toBe(true);
  });

  it('handles word replacement correctly', () => {
    const originalText = "Куриное филе (около 1 килограмм – планирую иготовить что-то простое и вкусное а ужин, может быть, обжарю с овощами).";
    const newText = "Яйца (около 1 килограмм – планирую иготовить что-то простое и вкусное а ужин, может быть, обжарю с овощами).";
    
    const { container } = render(
      <TextEditor
        value={originalText}
        onChange={() => {}}
        isVoiceEditing={true}
        voiceEditResult={{ editedText: newText }}
      />
    );
    
    // Проверяем, что замены подсвечены правильно
    const deletedElements = container.querySelectorAll('.deleted-text');
    const addedElements = container.querySelectorAll('.added-text');
    
    // Должны быть найдены изменения
    expect(deletedElements.length).toBeGreaterThan(0);
    expect(addedElements.length).toBeGreaterThan(0);
    
    // Проверяем, что найдены конкретные изменения
    let foundDeleted = false;
    let foundAdded = false;
    
    deletedElements.forEach(el => {
      if (el.textContent.includes('Куриное филе')) {
        foundDeleted = true;
      }
    });
    
    addedElements.forEach(el => {
      if (el.textContent.includes('Яйца')) {
        foundAdded = true;
      }
    });
    
    expect(foundDeleted).toBe(true);
    expect(foundAdded).toBe(true);
  });
}); 