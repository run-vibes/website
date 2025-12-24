import { cn } from '@/lib/cn'
import type { InterviewQuestion as QuestionType } from '../config/questions'
import { AnswerCard } from './AnswerCard'

interface InterviewQuestionProps {
  question: QuestionType
  currentValue?: string
  disabled?: boolean
  onAnswer: (questionId: string, value: string) => void
  className?: string
}

export function InterviewQuestion({
  question,
  currentValue,
  disabled = false,
  onAnswer,
  className,
}: InterviewQuestionProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{question.question}</h2>
        {question.subtitle && <p className="text-muted-foreground text-sm">{question.subtitle}</p>}
      </div>
      <div
        className={cn(
          'grid gap-4',
          question.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2',
        )}
      >
        {question.options.map((option) => (
          <AnswerCard
            key={option.value}
            icon={option.icon}
            label={option.label}
            value={option.value}
            selected={currentValue === option.value}
            disabled={disabled}
            onSelect={(value) => onAnswer(question.id, value)}
          />
        ))}
      </div>
    </div>
  )
}
