const CONTENT = {
  hero: {
    headline: 'The studio where AI agents come to life',
    subheadline: 'Delivering impact you can measure',
    description:
      'We design and build AI agents that transform how businesses operate — from intelligent automation to multi-agent systems that scale.',
    primaryCta: "Let's Talk",
    secondaryCta: 'See Our Work',
  },

  services: [
    {
      title: 'Agent Development',
      tagline: 'Intelligent agents. Coordinated swarms. Real-world impact.',
      description:
        'End-to-end design and development of AI agents — from single agents to multi-agent orchestration.',
      icon: 'agent',
    },
    {
      title: 'AI Strategy & Consulting',
      tagline: 'Navigate the AI landscape with a clear plan.',
      description: 'AI readiness assessments, architecture reviews, and transformation roadmaps.',
      icon: 'strategy',
    },
    {
      title: 'Product Development',
      tagline: 'Ship AI products that users love.',
      description:
        'New product ideation, AI feature integration, and scaling from MVP to production.',
      icon: 'product',
    },
    {
      title: 'Workshops & Training',
      tagline: 'Empower your team to think in agents.',
      description: 'Hands-on agent-building workshops and executive AI literacy sessions.',
      icon: 'workshop',
    },
  ],

  caseStudies: [
    {
      industry: 'Fintech',
      title: 'Automated Compliance Agent',
      challenge: 'Manual compliance reviews taking 40+ hours per week',
      outcome: '85% reduction in review time, zero compliance violations',
      metrics: ['85%', 'time saved'],
    },
    {
      industry: 'E-commerce',
      title: 'Inventory Optimization System',
      challenge: 'Stockouts and overstock costing millions annually',
      outcome: 'Real-time demand prediction with 94% accuracy',
      metrics: ['94%', 'accuracy'],
    },
    {
      industry: 'SaaS',
      title: 'Customer Support Automation',
      challenge: 'Support team overwhelmed with repetitive queries',
      outcome: '70% of tickets resolved automatically',
      metrics: ['70%', 'auto-resolved'],
    },
  ],

  industries: [
    { name: 'Fintech', icon: 'fintech' },
    { name: 'E-commerce', icon: 'ecommerce' },
    { name: 'SaaS', icon: 'saas' },
    { name: 'Professional Services', icon: 'services' },
  ],

  insights: [
    {
      title: 'Building Multi-Agent Systems That Scale',
      category: 'Technical',
      readTime: '8 min',
    },
    {
      title: 'The ROI of AI Agents: A Framework',
      category: 'Business',
      readTime: '5 min',
    },
    {
      title: "From Chatbot to Agent: What's the Difference?",
      category: 'Technical',
      readTime: '6 min',
    },
  ],

  finalCta: {
    headline: 'Ready to bring your AI vision to life?',
    description: "Let's talk about what you're building.",
    primaryCta: 'Start a Conversation',
    secondaryCta: 'Subscribe to Insights',
  },

  footer: {
    copyright: '© 2025 Vibes. All rights reserved.',
    links: ['About', 'Careers', 'Privacy', 'Terms'],
  },
}

// Make available globally for prototypes
if (typeof window !== 'undefined') {
  window.CONTENT = CONTENT
}
