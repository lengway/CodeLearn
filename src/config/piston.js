module.exports = {
    apiUrl: process.env.PISTON_API_URL || process.env.JUDGE0_API_URL || 'http://localhost:2358',
    
    // Language IDs (для совместимости с БД и фронтом)
    languageIds: {
        python: 71,
        javascript: 63,
        cpp: 54,
        c: 50,
        java: 62
    },
    
    // Piston language mapping (ID -> Piston config)
    languages: {
        71: { language: 'python', version: '3.10.0', filename: 'main.py' },
        63: { language: 'javascript', version: '18.15.0', filename: 'main.js' },
        54: { language: 'c++', version: '10.2.0', filename: 'main.cpp' },
        50: { language: 'c', version: '10.2.0', filename: 'main.c' },
        62: { language: 'java', version: '15.0.2', filename: 'Main.java' }
    },
    
    // Execution limits
    limits: {
        compileTimeout: 3000,   // ms
        runTimeout: 3000,       // ms
        compileMemory: -1,      // unlimited
        runMemory: -1           // unlimited
    },
    
    // Status descriptions
    statuses: {
        ACCEPTED: 'Accepted',
        WRONG_ANSWER: 'Wrong Answer',
        COMPILATION_ERROR: 'Compilation Error',
        RUNTIME_ERROR: 'Runtime Error'
    }
};
