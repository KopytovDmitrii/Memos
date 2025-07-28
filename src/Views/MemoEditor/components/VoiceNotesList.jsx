import React from 'react';
import VoiceNoteItem from '../../../Components/Molecules/VoiceNoteItem';
import './VoiceNotesList.css';

const VoiceNotesList = ({ voiceNotes, onPlay, onEdit, onDelete }) => {
  if (voiceNotes.length === 0) {
    return null;
  }

  return (
    <div className="voice-notes-list">
      <h2 className="voice-notes-list__title">Voice Notes</h2>
      <div className="voice-notes-list__items">
        {voiceNotes.map(voiceNote => (
          <VoiceNoteItem
            key={voiceNote.id}
            title={voiceNote.title}
            duration={voiceNote.duration}
            addedTime={voiceNote.addedTime}
            progress={voiceNote.progress}
            onPlay={() => onPlay(voiceNote.id)}
            onEdit={() => onEdit(voiceNote.id)}
            onDelete={() => onDelete(voiceNote.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default VoiceNotesList; 