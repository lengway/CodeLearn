module.exports = {
    apiUrl: process.env.JUDGE0_API_URL || 'http://localhost:2358',
    apiKey: process.env.JUDGE0_API_KEY || '',
    
    // Language IDs for Judge0
    languages: {
        python: 71,      // Python 3.8.1
        javascript: 63,  // JavaScript (Node.js 12.14.0)
        cpp: 54,         // C++ (GCC 9.2.0)
        c: 50,           // C (GCC 9.2.0)
        java: 62,        // Java (OpenJDK 13.0.1)
        csharp: 51,      // C# (Mono 6.6.0.161)
        ruby: 72,        // Ruby (2.7.0)
        go: 60,          // Go (1.13.5)
        rust: 73,        // Rust (1.40.0)
        php: 68,         // PHP (7.4.1)
    },
    
    // Status codes from Judge0
    statuses: {
        IN_QUEUE: 1,
        PROCESSING: 2,
        ACCEPTED: 3,
        WRONG_ANSWER: 4,
        TIME_LIMIT_EXCEEDED: 5,
        COMPILATION_ERROR: 6,
        RUNTIME_ERROR_SIGSEGV: 7,
        RUNTIME_ERROR_SIGXFSZ: 8,
        RUNTIME_ERROR_SIGFPE: 9,
        RUNTIME_ERROR_SIGABRT: 10,
        RUNTIME_ERROR_NZEC: 11,
        RUNTIME_ERROR_OTHER: 12,
        INTERNAL_ERROR: 13,
        EXEC_FORMAT_ERROR: 14
    },
    
    // Default limits
    defaults: {
        timeLimit: 2.0,       // seconds
        memoryLimit: 128000,  // KB
        maxSourceCodeLength: 50000  // characters
    }
};
