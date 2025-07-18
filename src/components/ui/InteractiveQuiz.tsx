'use client';

import React, { useState, useEffect } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface InteractiveQuizProps {
  title: string;
  questions?: string | QuizQuestion[];
  question1?: string;
  question1_options?: string;
  question1_correct?: string;
  question2?: string;
  question2_options?: string;
  question2_correct?: string;
  question3?: string;
  question3_options?: string;
  question3_correct?: string;
  perfectScoreMessage: string;
  goodScoreMessage: string;
  averageScoreMessage: string;
  lowScoreMessage: string;
  onClick?: () => void;
}

export function InteractiveQuiz({
  title = 'How Well Do You Know Me?',
  questions,
  question1,
  question1_options,
  question1_correct,
  question2,
  question2_options,
  question2_correct,
  question3,
  question3_options,
  question3_correct,
  perfectScoreMessage = 'Wow! You know me perfectly! We must be soulmates! 💕',
  goodScoreMessage = 'Great job! You know me pretty well! 😊',
  averageScoreMessage = 'Not bad! You know some things about me! 🤔',
  lowScoreMessage = 'Hmm... We need to spend more time together! 😅',
  onClick,
}: InteractiveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confetti, setConfetti] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      rotation: number;
      speed: number;
    }>
  >([]);

  // Parse questions from questions array or individual properties (legacy)
  const parsedQuestions: QuizQuestion[] = React.useMemo(() => {
    // If questions prop is provided as an array, use that
    if (questions && Array.isArray(questions)) {
      return questions
        .filter(
          q =>
            q.question && q.question.trim() && q.options && q.options.length > 0
        )
        .map(q => {
          // Filter out empty options first
          const validOptions = q.options
            .filter((opt: string) => opt && opt.trim())
            .slice(0, 4);

          // Adjust correct answer index based on filtered options
          let adjustedCorrectAnswer = q.correctAnswer || 0;
          if (adjustedCorrectAnswer >= validOptions.length) {
            adjustedCorrectAnswer = 0; // Default to first option if index is out of bounds
          }

          return {
            question: q.question.trim(),
            options: validOptions,
            correctAnswer: adjustedCorrectAnswer,
          };
        })
        .filter(q => q.options.length >= 2); // Only include questions with at least 2 options
    }

    // If questions prop is provided as string (legacy JSON format), use that
    if (questions && typeof questions === 'string') {
      try {
        const parsed = JSON.parse(questions);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(
              q =>
                q.question &&
                q.question.trim() &&
                q.options &&
                q.options.length > 0
            )
            .map(q => {
              // Filter out empty options first
              const validOptions = q.options
                .filter((opt: string) => opt && opt.trim())
                .slice(0, 4);

              // Adjust correct answer index based on filtered options
              let adjustedCorrectAnswer = q.correctAnswer || 0;
              if (adjustedCorrectAnswer >= validOptions.length) {
                adjustedCorrectAnswer = 0; // Default to first option if index is out of bounds
              }

              return {
                question: q.question.trim(),
                options: validOptions,
                correctAnswer: adjustedCorrectAnswer,
              };
            })
            .filter(q => q.options.length >= 2);
        }
      } catch {
        return [];
      }
    }

    // Otherwise, build questions from individual properties (legacy)
    const builtQuestions: QuizQuestion[] = [];

    // Question 1
    if (question1 && question1_options) {
      const options = question1_options
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt);
      if (options.length >= 2) {
        builtQuestions.push({
          question: question1,
          options: options.slice(0, 4), // Max 4 options
          correctAnswer: parseInt(question1_correct || '0'),
        });
      }
    }

    // Question 2
    if (question2 && question2_options) {
      const options = question2_options
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt);
      if (options.length >= 2) {
        builtQuestions.push({
          question: question2,
          options: options.slice(0, 4), // Max 4 options
          correctAnswer: parseInt(question2_correct || '0'),
        });
      }
    }

    // Question 3
    if (question3 && question3_options) {
      const options = question3_options
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt);
      if (options.length >= 2) {
        builtQuestions.push({
          question: question3,
          options: options.slice(0, 4), // Max 4 options
          correctAnswer: parseInt(question3_correct || '0'),
        });
      }
    }

    return builtQuestions;
  }, [
    questions,
    question1,
    question1_options,
    question1_correct,
    question2,
    question2_options,
    question2_correct,
    question3,
    question3_options,
    question3_correct,
  ]);

  const totalQuestions = parsedQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    const currentQ = parsedQuestions[currentQuestion];
    if (!currentQ) return;
    const correct = answerIndex === currentQ.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);

    console.log(
      `Question ${currentQuestion + 1}: Selected ${answerIndex}, Correct is ${currentQ.correctAnswer}, Is correct: ${correct}`
    );

    // Show feedback for a moment before moving to next question
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1);
        setIsAnswered(false);
        setIsCorrect(false);
      } else {
        // Quiz completed
        console.log('Quiz completed, calculating score...');
        // Calculate score with the final answer included
        const finalAnswers = [...newAnswers];
        finalAnswers[currentQuestion] = answerIndex;
        console.log('Final selectedAnswers:', finalAnswers);

        // Calculate score immediately with the final answers
        let correctAnswers = 0;
        finalAnswers.forEach((answer, index) => {
          const question = parsedQuestions[index];
          if (question && answer === question.correctAnswer) {
            correctAnswers++;
            console.log(
              `Question ${index + 1}: Correct! Selected ${answer}, Expected ${question.correctAnswer}`
            );
          } else if (question) {
            console.log(
              `Question ${index + 1}: Wrong! Selected ${answer}, Expected ${question.correctAnswer}`
            );
          }
        });

        const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
        console.log(
          `Final Score: ${correctAnswers}/${totalQuestions} = ${finalScore}%`
        );
        setScore(finalScore);

        // Show celebration for good scores
        if (finalScore >= 70) {
          setShowCelebration(true);
          createConfetti();
        }

        setShowResults(true);
        onClick?.();
      }
    }, 1500);
  };

  // Calculate final score
  const calculateScore = () => {
    let correctAnswers = 0;
    console.log('Scoring Debug:', {
      selectedAnswers,
      parsedQuestions: parsedQuestions.map(q => ({
        question: q.question,
        correctAnswer: q.correctAnswer,
        options: q.options,
      })),
      totalQuestions,
    });

    selectedAnswers.forEach((answer, index) => {
      const question = parsedQuestions[index];
      if (question && answer === question.correctAnswer) {
        correctAnswers++;
        console.log(
          `Question ${index + 1}: Correct! Selected ${answer}, Expected ${question.correctAnswer}`
        );
      } else if (question) {
        console.log(
          `Question ${index + 1}: Wrong! Selected ${answer}, Expected ${question.correctAnswer}`
        );
      }
    });

    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    console.log(
      `Final Score: ${correctAnswers}/${totalQuestions} = ${finalScore}%`
    );
    setScore(finalScore);

    // Show celebration for good scores
    if (finalScore >= 70) {
      setShowCelebration(true);
      createConfetti();
    }
  };

  // Create confetti celebration
  const createConfetti = () => {
    const colors = [
      '#FF6B9D',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#FFD93D',
      '#FF6B6B',
      '#4ECDC4',
    ];
    const newConfetti = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)] || '#FF6B9D',
      rotation: Math.random() * 360,
      speed: 2 + Math.random() * 4,
    }));
    setConfetti(newConfetti);
  };

  // Animate confetti
  useEffect(() => {
    if (confetti.length > 0) {
      const interval = setInterval(() => {
        setConfetti(prev =>
          prev
            .map(particle => ({
              ...particle,
              y: particle.y + particle.speed,
              rotation: particle.rotation + 8,
            }))
            .filter(particle => particle.y < 110)
        );
      }, 50);
      return () => clearInterval(interval);
    }
  }, [confetti]);

  // Get result message based on score
  const getResultMessage = () => {
    if (score >= 90) return perfectScoreMessage;
    if (score >= 70) return goodScoreMessage;
    if (score >= 50) return averageScoreMessage;
    return lowScoreMessage;
  };

  // Get result emoji based on score
  const getResultEmoji = () => {
    if (score >= 90) return '💕';
    if (score >= 70) return '😊';
    if (score >= 50) return '🤔';
    return '😅';
  };

  // Container classes
  const containerClass = [
    'relative',
    'bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50',
    'backdrop-blur-xl',
    'border border-white/40',
    'rounded-3xl',
    'shadow-2xl',
    'shadow-blue-500/10',
    'flex',
    'flex-col',
    'justify-center',
    'items-center',
    'overflow-hidden',
    'p-6',
    'sm:p-8',
    'md:p-10',
    'w-full',
    'max-w-sm',
    'sm:max-w-md',
    'md:max-w-lg',
    'lg:max-w-xl',
    'min-h-[400px]',
    'sm:min-h-[450px]',
    'md:min-h-[500px]',
    'mx-auto',
    'transform',
    'transition-all',
    'duration-500',
    'hover:scale-[1.02]',
    'hover:shadow-blue-500/20',
  ].join(' ');

  if (totalQuestions === 0) {
    return (
      <div className={containerClass} onClick={e => e.stopPropagation()}>
        <div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
          <div className='text-6xl mb-4'>🧠</div>
          <h3 className='text-xl font-bold text-gray-800'>Interactive Quiz</h3>
          <p className='text-gray-600'>Add questions to start the quiz!</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className={containerClass} onClick={e => e.stopPropagation()}>
        {/* Confetti Overlay */}
        {showCelebration && confetti.length > 0 && (
          <div className='absolute inset-0 pointer-events-none overflow-hidden z-20'>
            {confetti.map(particle => (
              <div
                key={particle.id}
                className='absolute rounded-full animate-pulse'
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${Math.random() * 8 + 4}px`,
                  height: `${Math.random() * 8 + 4}px`,
                  backgroundColor: particle.color,
                  transform: `rotate(${particle.rotation}deg)`,
                  transition: 'all 0.1s linear',
                  boxShadow: `0 0 10px ${particle.color}80`,
                }}
              />
            ))}
          </div>
        )}

        <div className='flex flex-col items-center justify-center h-full text-center space-y-6'>
          <div className='text-6xl mb-4 animate-bounce'>{getResultEmoji()}</div>

          <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
            Quiz Complete!
          </h2>

          <div className='space-y-4'>
            <div className='text-4xl font-bold text-gray-800'>{score}%</div>
            <div className='text-lg text-gray-600'>{getResultMessage()}</div>
          </div>

          <div className='space-y-2 text-sm text-gray-500'>
            <p>
              You got {Math.round((score / 100) * totalQuestions)} out of{' '}
              {totalQuestions} questions correct!
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswers([]);
              setIsAnswered(false);
              setIsCorrect(false);
              setShowResults(false);
              setScore(0);
              setShowCelebration(false);
              setConfetti([]);
            }}
            className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg'
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  const currentQ = parsedQuestions[currentQuestion];

  if (!currentQ) {
    return (
      <div className={containerClass} onClick={e => e.stopPropagation()}>
        <div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
          <div className='text-6xl mb-4'>❌</div>
          <h3 className='text-xl font-bold text-gray-800'>Quiz Error</h3>
          <p className='text-gray-600'>
            Invalid question data. Please check the quiz configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass} onClick={e => e.stopPropagation()}>
      <div className='flex flex-col items-center justify-center w-full h-full space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h3 className='text-xl font-bold text-gray-800'>{title}</h3>
          <div className='text-sm text-gray-600'>
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
        </div>

        {/* Progress Bar */}
        <div className='w-full max-w-xs'>
          <div className='bg-gray-200 rounded-full h-2'>
            <div
              className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className='text-center space-y-6 max-w-sm'>
          <h4 className='text-lg font-semibold text-gray-800 leading-relaxed'>
            {currentQ.question}
          </h4>

          {/* Answer Options */}
          <div className='space-y-3'>
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const isCorrectAnswer = index === currentQ.correctAnswer;

              let buttonClass =
                'w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 text-left';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  buttonClass += ' bg-green-500 text-white shadow-lg scale-105';
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass += ' bg-red-500 text-white shadow-lg';
                } else {
                  buttonClass += ' bg-gray-200 text-gray-600 opacity-60';
                }
              } else {
                buttonClass +=
                  ' bg-white hover:bg-blue-50 text-gray-800 border-2 border-gray-200 hover:border-blue-300 hover:scale-105 shadow-md';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <div className='flex items-center space-x-3'>
                    <div className='w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold'>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div
              className={`text-center p-4 rounded-xl transition-all duration-500 ${
                isCorrect
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              <div className='text-2xl mb-2'>{isCorrect ? '✅' : '❌'}</div>
              <div className='font-semibold'>
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </div>
              {!isCorrect && (
                <div className='text-sm mt-1'>
                  The correct answer was:{' '}
                  {currentQ.options[currentQ.correctAnswer]}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
