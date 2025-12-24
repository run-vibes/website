export interface QuestionOption {
  value: string
  label: string
  icon: string
}

export interface InterviewQuestion {
  id: string
  question: string
  subtitle?: string
  options: QuestionOption[]
  phase: 'opener' | 'personality' | 'qualification' | 'post_contact'
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // Opener
  {
    id: 'intent',
    question: 'What brings you to Vibes today?',
    subtitle: "We'll tailor the conversation to your needs",
    phase: 'opener',
    options: [
      { value: 'specific_project', label: 'I have a specific AI project in mind', icon: '🎯' },
      { value: 'exploring', label: "I'm exploring what's possible with AI", icon: '🔍' },
      { value: 'existing_system', label: 'I need help with an existing AI system', icon: '🔧' },
      { value: 'upskill', label: 'I want to upskill my team', icon: '🎓' },
    ],
  },
  {
    id: 'role',
    question: "What's your perspective on this?",
    phase: 'opener',
    options: [
      { value: 'technical', label: 'Technical (CTO, VP Eng, Developer)', icon: '⚙️' },
      { value: 'business', label: 'Business (CEO, COO, Strategy)', icon: '📊' },
      { value: 'ai_lead', label: 'AI/Innovation Lead', icon: '🚀' },
      { value: 'founder', label: 'Founder building something new', icon: '💡' },
    ],
  },
  // Personality
  {
    id: 'ai_maturity',
    question: "Your team's relationship with AI is best described as...",
    phase: 'personality',
    options: [
      { value: 'first_date', label: 'First date — curious but cautious', icon: '🌱' },
      { value: 'going_steady', label: 'Going steady — some experiments working', icon: '🔥' },
      { value: 'committed', label: 'Committed — AI is core to our strategy', icon: '💍' },
    ],
  },
  {
    id: 'working_style',
    question: 'When you work with partners, you prefer...',
    phase: 'personality',
    options: [
      { value: 'full_ownership', label: 'Give us the keys — full ownership', icon: '🎯' },
      { value: 'embedded', label: 'Collaborate closely — embedded partnership', icon: '🤝' },
      {
        value: 'knowledge_transfer',
        label: 'Teach us to fish — knowledge transfer focus',
        icon: '🎓',
      },
    ],
  },
  // Qualification
  {
    id: 'timeline',
    question: 'When are you looking to move?',
    phase: 'qualification',
    options: [
      { value: 'asap', label: 'ASAP (within weeks)', icon: '🔥' },
      { value: 'quarter', label: 'This quarter', icon: '📅' },
      { value: 'year', label: 'This year', icon: '🗓️' },
      { value: 'exploring', label: 'Just exploring', icon: '🔭' },
    ],
  },
  {
    id: 'company_size',
    question: 'How big is your organization?',
    phase: 'qualification',
    options: [
      { value: 'startup', label: 'Startup (1-20)', icon: '🚀' },
      { value: 'growth', label: 'Growth (21-100)', icon: '📈' },
      { value: 'midmarket', label: 'Mid-market (101-1000)', icon: '🏢' },
      { value: 'enterprise', label: 'Enterprise (1000+)', icon: '🏛️' },
    ],
  },
  {
    id: 'industry',
    question: 'What space are you in?',
    phase: 'qualification',
    options: [
      { value: 'fintech', label: 'Fintech', icon: '💳' },
      { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
      { value: 'saas', label: 'SaaS', icon: '💻' },
      { value: 'professional_services', label: 'Professional Services', icon: '👔' },
      { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
      { value: 'other', label: 'Other', icon: '🎯' },
    ],
  },
  // Post-contact
  {
    id: 'budget_range',
    question: "What's your budget range for this initiative?",
    phase: 'post_contact',
    options: [
      { value: 'under_50k', label: 'Under $50k', icon: '💰' },
      { value: '50k_150k', label: '$50k – $150k', icon: '💰💰' },
      { value: '150k_500k', label: '$150k – $500k', icon: '💰💰💰' },
      { value: '500k_plus', label: '$500k+', icon: '💰💰💰💰' },
      { value: 'unsure', label: 'Not sure yet', icon: '🤷' },
    ],
  },
]

export function getQuestionById(id: string): InterviewQuestion | undefined {
  return INTERVIEW_QUESTIONS.find((q) => q.id === id)
}

export function getStructuredQuestions(): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.phase !== 'post_contact')
}

export function getPostContactQuestions(): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.phase === 'post_contact')
}

const RESPONSE_STARTERS: Record<string, string[]> = {
  problem: [
    'Our biggest challenge is...',
    "We've been struggling with...",
    'Our customers keep asking for...',
  ],
  vision: ['If this worked, we could...', 'The dream scenario is...', "We'd measure success by..."],
  users: ['Our internal team needs...', 'Our customers want...', 'Both internal and external...'],
}

export function getResponseStarters(promptType: string): string[] {
  return RESPONSE_STARTERS[promptType] ?? []
}
