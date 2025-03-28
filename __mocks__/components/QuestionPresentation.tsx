import React from 'react';
import { Question } from '../../../client/src/types/assessment.types';

export const QuestionPresentation: React.FC<{
  question: Question;
  onAnswer: (answer: any) => void;
  isAnswered: boolean;
}> = jest.fn().mockImplementation(({ question, onAnswer, isAnswered }) => (
  <div data-testid="mock-question-presentation">
    <h3>{question.text}</h3>
    <div>
      {question.options?.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswer(option.value)}
          disabled={isAnswered}
        >
          {option.text}
        </button>
      ))}
    </div>
  </div>
)); 