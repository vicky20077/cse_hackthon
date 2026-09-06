import { ExperienceLevel, InterviewType, InterviewQuestion, AnswerEvaluation, InterviewReport, StarAnalysis } from '@/types/interview';

// Curated question templates per role and level
const QUESTION_BANKS: Record<string, { easy: string[]; medium: string[]; hard: string[]; behavioral: string[] }> = {
  'Full Stack Developer': {
    easy: [
      'Can you explain the difference between authentication and authorization in a modern web application?',
      'How does the browser rendering lifecycle work, and what is the difference between client-side rendering (CSR) and server-side rendering (SSR)?',
      'What are RESTful APIs, and what is the significance of HTTP status codes like 200, 201, 401, 403, and 500?',
    ],
    medium: [
      'How would you handle state management across deeply nested components in a complex React application?',
      'How do you design a database schema in PostgreSQL to handle a many-to-many relationship with transactional integrity?',
      'How do you securely store session tokens or JWTs on the client side to mitigate XSS and CSRF attacks?',
    ],
    hard: [
      'Walk me through how you would architect a real-time collaborative dashboard handling 50,000 concurrent websocket connections.',
      'How would you implement database sharding, read replicas, and caching invalidation strategies for an e-commerce platform?',
    ],
    behavioral: [
      'Tell me about a challenging full-stack project you worked on. What architectural trade-offs did you make and what was the outcome?',
      'Describe a time when you encountered a critical production bug or performance bottleneck. How did you diagnose and resolve it?',
    ],
  },
  'Frontend Developer': {
    easy: [
      'Can you explain how the Virtual DOM works in React and how reconciliation differs from direct DOM manipulation?',
      'What are CSS box models, Flexbox, and CSS Grid, and when would you choose Grid over Flexbox?',
      'How do the useEffect and useMemo hooks work in React, and what are common pitfalls when using them?',
    ],
    medium: [
      'How would you optimize Core Web Vitals (LCP, FID/INP, CLS) for a high-traffic media application?',
      'Explain how event bubbling and event delegation work in JavaScript, and provide a practical use case.',
      'How do you structure reusable component libraries with accessibility (ARIA) and keyboard navigation in mind?',
    ],
    hard: [
      'How does module bundling work under the hood in Webpack or Vite, and how do you implement route-based code splitting and tree shaking?',
      'Describe how you would build an offline-first Progressive Web App (PWA) with background sync and IndexedDB caching.',
    ],
    behavioral: [
      'Tell me about a time you had a design disagreement with a UI/UX designer or product manager. How did you resolve it?',
      'Describe a situation where you had to refactor a legacy frontend codebase without breaking existing user flows.',
    ],
  },
  'Backend Developer': {
    easy: [
      'What is the difference between synchronous and asynchronous I/O in backend runtimes like Node.js or Python?',
      'Explain ACID properties in relational database management systems and why they matter.',
      'What is the difference between SQL and NoSQL databases, and how do you decide which to use?',
    ],
    medium: [
      'How would you implement rate limiting on an API gateway to prevent DDoS and API abuse?',
      'Explain the difference between horizontal and vertical database scaling, and how read replicas work.',
      'How do message queues like RabbitMQ or Kafka help in decoupling microservices architecture?',
    ],
    hard: [
      'How would you handle distributed transactions across multiple microservices without locking resources (e.g. Saga pattern)?',
      'Describe how you would design an idempotent payment processing endpoint that prevents duplicate charges even during network failures.',
    ],
    behavioral: [
      'Describe a situation where a database query caused high CPU usage or an outage. How did you investigate with EXPLAIN ANALYZE?',
      'Tell me about a time you had to balance building features quickly versus addressing technical debt.',
    ],
  },
  'Software Engineer': {
    easy: [
      'What is the time and space complexity of common sorting algorithms like MergeSort and QuickSort?',
      'Explain the four pillars of Object-Oriented Programming (OOP) with concise examples.',
      'What is the difference between a process and a thread, and how does context switching work?',
    ],
    medium: [
      'How does a Hash Map handle collisions under the hood, and what happens when the load factor is exceeded?',
      'Explain how garbage collection works in modern managed runtimes.',
      'How would you detect and resolve deadlocks in a multi-threaded application?',
    ],
    hard: [
      'Walk me through the design of an LRU (Least Recently Used) cache with O(1) get and put operations.',
      'How would you design a distributed unique ID generator similar to Twitter Snowflake at global scale?',
    ],
    behavioral: [
      'Tell me about a complex algorithmic problem you solved recently and how you evaluated trade-offs.',
      'Describe a time you received constructive feedback on a code review and how you adapted.',
    ],
  },
  'AI/ML Engineer': {
    easy: [
      'What is the difference between supervised, unsupervised, and reinforcement learning?',
      'Explain the bias-variance tradeoff and how regularization techniques like L1 and L2 prevent overfitting.',
      'How do activation functions like ReLU, Sigmoid, and GELU impact neural network training?',
    ],
    medium: [
      'Explain the Self-Attention mechanism in the Transformer architecture.',
      'How do you design a Retrieval-Augmented Generation (RAG) pipeline with semantic chunking and vector embeddings?',
      'What metrics do you use to evaluate classification models when dealing with heavily imbalanced datasets?',
    ],
    hard: [
      'How would you optimize inference latency for a large language model (e.g., quantization, KV caching, vLLM, speculative decoding)?',
      'Describe how you would prevent hallucination and evaluate faithfulness in an enterprise LLM agent system.',
    ],
    behavioral: [
      'Tell me about an AI model you trained that failed to perform well in production. How did you debug the data distribution shift?',
      'Describe how you prioritize model accuracy versus inference latency and compute cost.',
    ],
  },
};

// Generic fallback bank for any other role
const GENERIC_QUESTION_BANK = {
  easy: [
    'Can you give a brief overview of your technical background and your primary areas of expertise?',
    'What tools, frameworks, and methodologies do you rely on most in your daily workflow?',
    'How do you approach debugging or troubleshooting when an unexpected error occurs?',
  ],
  medium: [
    'How do you ensure high quality, maintainability, and scalability in the solutions you build?',
    'Can you describe a key trade-off you had to make in a recent technical or strategic decision?',
    'How do you stay up-to-date with emerging industry technologies and best practices?',
  ],
  hard: [
    'Walk me through how you would architect a complex end-to-end solution for your target role from scratch.',
    'How do you evaluate performance bottlenecks and optimize critical workflows under heavy constraints?',
  ],
  behavioral: [
    'Tell me about a significant project you led or contributed to. What was your specific role, and what were the outcomes?',
    'Describe a situation where requirements changed abruptly midway through a sprint. How did you adapt?',
  ],
};

export class MockAIEngine {
  static generateFirstQuestion(role: string, level: ExperienceLevel, interviewType: InterviewType, resumeSkills: string[] = []): InterviewQuestion {
    const bank = QUESTION_BANKS[role] || GENERIC_QUESTION_BANK;
    let questionText = '';
    let questionType: InterviewQuestion['questionType'] = 'technical';
    let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
    const interviewerReaction = `Welcome! I'm your AI interviewer for the ${role} position. Let's start with our first question.`;

    if (interviewType === 'Resume Based' && resumeSkills.length > 0) {
      const topSkills = resumeSkills.slice(0, 3).join(', ');
      questionText = `I noticed in your resume that you have experience with ${topSkills}. Could you walk me through a project where you applied these technologies and what architectural decisions you made?`;
      questionType = 'technical';
      difficulty = level === 'Experienced' ? 'Medium' : 'Easy';
    } else if (interviewType === 'HR / Behavioral') {
      questionText = bank.behavioral[0] || 'Tell me about yourself and what motivated you to pursue this role.';
      questionType = 'behavioral';
    } else {
      if (level === 'Internship') {
        questionText = bank.easy[0] || bank.easy[1];
        difficulty = 'Easy';
      } else if (level === 'Fresher') {
        questionText = bank.easy[0] || bank.medium[0];
        difficulty = 'Easy';
      } else {
        questionText = bank.medium[0] || bank.hard[0];
        difficulty = 'Medium';
      }
    }

    return {
      id: `q_${Date.now()}_1`,
      interviewId: '',
      questionNumber: 1,
      question: questionText,
      interviewerReaction,
      questionType,
      difficulty,
      category: role,
    };
  }

  static generateFollowUpQuestion(
    role: string,
    level: ExperienceLevel,
    interviewType: InterviewType,
    previousQuestion: InterviewQuestion,
    previousAnswer: string,
    questionNumber: number,
    totalQuestions: number
  ): InterviewQuestion {
    const trimmed = previousAnswer.trim();
    const lowerAnswer = trimmed.toLowerCase();
    const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
    let followUpText = '';
    let interviewerReaction = '';
    let questionType: InterviewQuestion['questionType'] = 'followup';
    let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';

    // Dynamic reaction and keyword triggers based on what the candidate said
    if (lowerAnswer.includes('mongodb') || lowerAnswer.includes('nosql')) {
      interviewerReaction = 'Good points on document data modeling and schema flexibility.';
      followUpText = 'You mentioned MongoDB. Why did you choose a document store over a relational database like PostgreSQL for this use case, and how did you handle indexing?';
    } else if (lowerAnswer.includes('redis') || lowerAnswer.includes('cache')) {
      interviewerReaction = 'Great explanation of in-memory caching and reducing database read pressure.';
      followUpText = 'You talked about caching with Redis. What was your cache invalidation strategy, and how did you mitigate cache stampedes or stale data?';
    } else if (lowerAnswer.includes('jwt') || lowerAnswer.includes('token') || lowerAnswer.includes('auth') || lowerAnswer.includes('oauth')) {
      interviewerReaction = 'Solid breakdown of identity verification and stateless token authentication.';
      followUpText = 'You brought up authentication. How did you handle token expiration and secure refresh token rotation across client and server?';
    } else if (lowerAnswer.includes('docker') || lowerAnswer.includes('kubernetes') || lowerAnswer.includes('container')) {
      interviewerReaction = 'Clear understanding of containerized deployment and environment parity.';
      followUpText = 'You mentioned containerization. How did you structure multi-stage builds to optimize image size and security in CI/CD?';
    } else if (lowerAnswer.includes('react') || lowerAnswer.includes('hooks') || lowerAnswer.includes('state') || lowerAnswer.includes('redux')) {
      interviewerReaction = 'I like your focus on state management and component predictability.';
      followUpText = 'You referenced React state management. How did you prevent unnecessary re-renders in performance-critical components?';
    } else if (lowerAnswer.includes('kafka') || lowerAnswer.includes('queue') || lowerAnswer.includes('event')) {
      interviewerReaction = 'Good insight on asynchronous processing and distributed messaging.';
      followUpText = 'You mentioned event-driven queues. How did you guarantee at-least-once message delivery and handle consumer failures?';
    } else if (lowerAnswer.includes('postgresql') || lowerAnswer.includes('sql') || lowerAnswer.includes('index') || lowerAnswer.includes('acid')) {
      interviewerReaction = 'Strong grasp of relational schemas and transaction guarantees.';
      followUpText = 'You discussed relational databases and indexing. When would a composite B-Tree index fail to be used by the query planner, and how do you analyze query execution plans?';
    } else if (questionNumber === totalQuestions) {
      interviewerReaction = wordCount > 40
        ? 'Thank you for that thorough and well-articulated response.'
        : 'Thanks for summarizing your perspective on that.';
      followUpText = 'To wrap up our interview: Looking back at your journey so far, what is one major technical concept you recently learned, and how has it shaped your approach to software craftsmanship?';
      questionType = 'behavioral';
      difficulty = 'Medium';
    } else {
      // Pick next role question based on progression
      const bank = QUESTION_BANKS[role] || GENERIC_QUESTION_BANK;
      if (wordCount > 50) {
        interviewerReaction = 'Excellent depth and technical detail in your response. That shows solid hands-on experience.';
      } else if (wordCount > 20) {
        interviewerReaction = 'Good explanation. You touched on the core fundamentals nicely.';
      } else if (wordCount > 0) {
        interviewerReaction = 'Thanks for that concise overview. Let us explore another core dimension.';
      } else {
        interviewerReaction = 'Let us proceed to the next technical question.';
      }

      if (interviewType === 'HR / Behavioral' || (interviewType === 'Mixed' && questionNumber % 2 === 0)) {
        followUpText = bank.behavioral[questionNumber % bank.behavioral.length];
        questionType = 'behavioral';
      } else {
        const pool = level === 'Experienced' ? [...bank.medium, ...bank.hard] : [...bank.easy, ...bank.medium];
        followUpText = pool[questionNumber % pool.length];
        questionType = 'technical';
        difficulty = level === 'Experienced' ? 'Hard' : 'Medium';
      }
    }

    return {
      id: `q_${Date.now()}_${questionNumber}`,
      interviewId: previousQuestion.interviewId,
      questionNumber,
      question: followUpText,
      interviewerReaction,
      questionType,
      difficulty,
      category: role,
    };
  }

  static evaluateAnswer(question: InterviewQuestion, answer: string): AnswerEvaluation {
    const trimmed = answer.trim();
    const lower = trimmed.toLowerCase();
    const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
    const sentenceCount = (trimmed.match(/[.!?]+/g) || []).length || 1;

    // ─── Baseline starts at 4.0 (not artificially inflated) ───
    let baseScore = 4.0;

    // ─── Word count scoring: penalise very short, reward substantive ───
    if (wordCount < 5) {
      baseScore -= 2.5; // essentially no answer
    } else if (wordCount < 15) {
      baseScore -= 1.5; // too brief
    } else if (wordCount < 30) {
      baseScore += 0.5;
    } else if (wordCount >= 30 && wordCount < 60) {
      baseScore += 1.5;
    } else if (wordCount >= 60 && wordCount < 120) {
      baseScore += 2.5;
    } else if (wordCount >= 120) {
      baseScore += 3.0; // detailed explanation
    }

    // ─── Sentence structure: reward articulate multi-sentence answers ───
    if (sentenceCount >= 3) baseScore += 0.4;
    if (sentenceCount >= 5) baseScore += 0.3;

    // ─── Domain keyword detection with weighted importance ───
    const keywordGroups: { keywords: string[]; weight: number; label: string }[] = [
      {
        keywords: ['authentication', 'authorization', 'jwt', 'oauth', 'session', 'cookie', 'rbac', 'token', 'bcrypt', 'hash'],
        weight: 0.5,
        label: 'Security & Auth',
      },
      {
        keywords: ['rest', 'api', 'graphql', 'endpoint', 'http', 'grpc', 'websocket', 'microservice', 'webhook'],
        weight: 0.45,
        label: 'APIs & Protocols',
      },
      {
        keywords: ['postgresql', 'mongodb', 'redis', 'sql', 'nosql', 'index', 'acid', 'transaction', 'query', 'orm', 'schema', 'normalization'],
        weight: 0.5,
        label: 'Database',
      },
      {
        keywords: ['react', 'hooks', 'state', 'props', 'component', 'virtual dom', 'reconciliation', 'context', 'redux', 'zustand'],
        weight: 0.4,
        label: 'Frontend',
      },
      {
        keywords: ['docker', 'kubernetes', 'ci/cd', 'pipeline', 'container', 'deployment', 'nginx', 'load balancer', 'scaling'],
        weight: 0.5,
        label: 'DevOps',
      },
      {
        keywords: ['kafka', 'rabbitmq', 'queue', 'event', 'pub/sub', 'async', 'message broker', 'stream'],
        weight: 0.5,
        label: 'Messaging',
      },
      {
        keywords: ['cache', 'cdn', 'memoization', 'ttl', 'invalidation', 'latency', 'throughput', 'optimization'],
        weight: 0.45,
        label: 'Performance',
      },
      {
        keywords: ['big o', 'complexity', 'algorithm', 'data structure', 'tree', 'graph', 'recursion', 'dynamic programming', 'sorting', 'hash map'],
        weight: 0.5,
        label: 'CS Fundamentals',
      },
      {
        keywords: ['architecture', 'design pattern', 'solid', 'mvc', 'microservices', 'monolith', 'service mesh', 'trade-off'],
        weight: 0.55,
        label: 'System Design',
      },
      {
        keywords: ['test', 'unit test', 'integration', 'e2e', 'tdd', 'mock', 'coverage', 'jest', 'cypress'],
        weight: 0.4,
        label: 'Testing',
      },
      {
        keywords: ['machine learning', 'neural network', 'transformer', 'embedding', 'vector', 'attention', 'llm', 'fine-tuning', 'inference'],
        weight: 0.55,
        label: 'AI/ML',
      },
    ];

    const keywordsFound: string[] = [];
    let keywordBonus = 0;

    for (const group of keywordGroups) {
      const matched = group.keywords.filter((kw) => lower.includes(kw));
      if (matched.length > 0) {
        keywordsFound.push(group.label);
        keywordBonus += group.weight * Math.min(matched.length, 3); // cap per group at 3 hits
      }
    }

    // Cap keyword bonus at 2.5 to avoid over-inflation
    keywordBonus = Math.min(keywordBonus, 2.5);
    baseScore += keywordBonus;

    // ─── Concrete examples & quantification reward ───
    const hasNumbers = /\d+/.test(trimmed);
    const hasExample =
      lower.includes('for example') ||
      lower.includes('for instance') ||
      lower.includes('such as') ||
      lower.includes('e.g') ||
      lower.includes('like when') ||
      lower.includes('in my project') ||
      lower.includes('i built') ||
      lower.includes('i implemented') ||
      lower.includes('we used');
    if (hasExample) baseScore += 0.4;
    if (hasNumbers) baseScore += 0.2;

    // ─── Trade-off / nuance awareness ───
    const hasTradeoff =
      lower.includes('trade-off') ||
      lower.includes('tradeoff') ||
      lower.includes('however') ||
      lower.includes('on the other hand') ||
      lower.includes('depends on') ||
      lower.includes('downside') ||
      lower.includes('limitation') ||
      lower.includes('alternative');
    if (hasTradeoff) baseScore += 0.3;

    // ─── Clamp base to [1.5, 9.5] ───
    baseScore = Math.max(1.5, Math.min(9.5, baseScore));

    // ─── Compute dimension scores with slight independent variation ───
    const rand = (offset: number, max: number) =>
      Number(Math.min(max, Math.max(1.0, baseScore + offset + (Math.random() * 0.4 - 0.2))).toFixed(1));

    const technicalScore = rand(keywordsFound.length > 2 ? 0.3 : -0.2, 9.5);
    const communicationScore = rand(
      sentenceCount >= 3 && wordCount > 30 ? 0.3 : -0.4,
      9.3
    );
    const relevanceScore = rand(keywordsFound.length > 0 ? 0.2 : -0.5, 9.4);
    const depthScore = rand(wordCount > 80 ? 0.4 : wordCount < 30 ? -0.6 : 0, 9.2);
    const confidenceScore = rand(hasExample ? 0.2 : -0.1, 9.3);
    const problemSolvingScore = rand(hasTradeoff ? 0.4 : -0.1, 9.4);

    // ─── Qualitative feedback ───
    const whatWasGood: string[] = [];
    if (wordCount >= 30) whatWasGood.push('Gave a substantive, well-developed response.');
    if (keywordsFound.length > 0)
      whatWasGood.push(`Demonstrated knowledge in: ${keywordsFound.slice(0, 3).join(', ')}.`);
    if (hasExample) whatWasGood.push('Grounded the explanation with a concrete example.');
    if (hasTradeoff) whatWasGood.push('Showed nuanced awareness of trade-offs and alternatives.');
    if (whatWasGood.length === 0) whatWasGood.push('Made an attempt to address the question.');

    const whatCouldImprove: string[] = [];
    if (wordCount < 40)
      whatCouldImprove.push('Elaborate further — aim for at least 60 words with concrete details.');
    if (!hasExample)
      whatCouldImprove.push('Back up your answer with a specific real-world example or project experience.');
    if (keywordsFound.length < 2)
      whatCouldImprove.push('Use precise technical terminology relevant to the question domain.');
    if (!hasTradeoff)
      whatCouldImprove.push('Discuss trade-offs or limitations to show deeper architectural thinking.');
    if (whatCouldImprove.length === 0)
      whatCouldImprove.push('Consider adding quantitative metrics (e.g., latency savings, scale handled).');

    // ─── STAR analysis for behavioral questions ───
    let starAnalysis: StarAnalysis | undefined = undefined;
    if (question.questionType === 'behavioral') {
      const hasSituation =
        lower.includes('project') || lower.includes('when') || lower.includes('team') ||
        lower.includes('company') || lower.includes('situation') || lower.includes('context');
      const hasTask =
        lower.includes('task') || lower.includes('goal') || lower.includes('needed') ||
        lower.includes('responsible') || lower.includes('challenge') || lower.includes('objective');
      const hasAction =
        lower.includes('i built') || lower.includes('i implemented') || lower.includes('i designed') ||
        lower.includes('i investigated') || lower.includes('i created') || lower.includes('i led') ||
        lower.includes('i proposed') || lower.includes('i fixed');
      const hasResult =
        lower.includes('result') || lower.includes('improved') || lower.includes('reduced') ||
        lower.includes('success') || lower.includes('learned') || lower.includes('outcome') ||
        lower.includes('increased') || lower.includes('%') || lower.includes('saved');

      const starScore = (hasSituation ? 2.5 : 0.8) + (hasTask ? 2.5 : 0.8) +
        (hasAction ? 2.5 : 1.0) + (hasResult ? 2.5 : 0.8);

      starAnalysis = {
        situation: {
          present: hasSituation,
          feedback: hasSituation
            ? 'Situation context clearly established.'
            : 'Missing background context — briefly describe the project or scenario.',
        },
        task: {
          present: hasTask,
          feedback: hasTask
            ? 'Task and objective well defined.'
            : 'Clarify the specific goal or responsibility you were assigned.',
        },
        action: {
          present: hasAction,
          feedback: hasAction
            ? 'Strong active voice describing your personal contribution.'
            : 'Use "I" statements to describe the exact actions YOU took.',
        },
        result: {
          present: hasResult,
          feedback: hasResult
            ? 'Demonstrated a tangible outcome or learning.'
            : 'Quantify the result — e.g. "reduced latency by 40%" or "shipped on time".',
        },
        overallStarScore: Number(starScore.toFixed(1)),
        advice:
          'Follow the STAR method: Situation → Task → Action → Result. Keep each part concise but specific.',
      };
    }

    return {
      technicalScore,
      communicationScore,
      relevanceScore,
      depthScore,
      confidenceScore,
      problemSolvingScore,
      whatWasGood,
      whatCouldImprove,
      idealAnswerStructure:
        '1. Direct definition / problem framing\n2. Core mechanism & how it works\n3. Real-world implementation example\n4. Trade-offs, edge cases & best practices',
      keyConceptsMentioned: keywordsFound.length > 0 ? keywordsFound : ['General Understanding'],
      starAnalysis,
    };
  }


  static generateReport(session: { role: string; level: ExperienceLevel; questions: InterviewQuestion[] }): InterviewReport {
    const questionsWithEval = session.questions.filter((q) => q.evaluation);
    let avgTech = 8.4;
    let avgComm = 8.0;
    let avgConf = 8.2;
    let avgProb = 8.3;
    let avgRel = 8.8;

    if (questionsWithEval.length > 0) {
      avgTech = questionsWithEval.reduce((acc, q) => acc + (q.evaluation?.technicalScore || 8.0), 0) / questionsWithEval.length;
      avgComm = questionsWithEval.reduce((acc, q) => acc + (q.evaluation?.communicationScore || 8.0), 0) / questionsWithEval.length;
      avgConf = questionsWithEval.reduce((acc, q) => acc + (q.evaluation?.confidenceScore || 8.0), 0) / questionsWithEval.length;
      avgProb = questionsWithEval.reduce((acc, q) => acc + (q.evaluation?.problemSolvingScore || 8.0), 0) / questionsWithEval.length;
      avgRel = questionsWithEval.reduce((acc, q) => acc + (q.evaluation?.relevanceScore || 8.0), 0) / questionsWithEval.length;
    }

    const overallScore = Number(((avgTech + avgComm + avgConf + avgProb + avgRel) / 5).toFixed(1));

    return {
      id: `rep_${Date.now()}`,
      interviewId: session.questions[0]?.interviewId || 'session-id',
      overallScore,
      technicalScore: Number(avgTech.toFixed(1)),
      communicationScore: Number(avgComm.toFixed(1)),
      confidenceScore: Number(avgConf.toFixed(1)),
      problemSolvingScore: Number(avgProb.toFixed(1)),
      relevanceScore: Number(avgRel.toFixed(1)),
      strengths: [
        `Demonstrated strong foundational knowledge in ${session.role} domain paradigms.`,
        'Articulated trade-offs clearly when responding to follow-up technical questions.',
        'Maintained structured and confident composure across all questions.',
      ],
      weaknesses: [
        'Could include more quantitative benchmarks (e.g. latency numbers, concurrency limits).',
        'Deepen explanation of edge case handling and failover resiliency.',
      ],
      recommendations: [
        `${session.role} System Design & Scalability Patterns`,
        'Advanced Query Optimization & Caching Invalidation',
        'STAR Method Storyboarding for Behavioral Rounds',
        'Security Best Practices (OWASP, RBAC, Encryption)',
      ],
      summary: `Candidate demonstrated solid technical readiness for ${session.role} at the ${session.level} level. Answers were relevant and structured, with strong problem-solving clarity. Continued practice on production architectural edge cases will elevate performance even higher.`,
      createdAt: new Date().toISOString(),
    };
  }
}
