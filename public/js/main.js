// Language icons mapping
const languageIcons = {
    python: '🐍',
    javascript: '📜',
    cpp: '⚙️',
    c: '🔧',
    java: '☕',
    default: '💻'
};

// Difficulty labels
const difficultyLabels = {
    beginner: { text: 'Beginner', class: 'difficulty-beginner' },
    intermediate: { text: 'Intermediate', class: 'difficulty-intermediate' },
    advanced: { text: 'Advanced', class: 'difficulty-advanced' }
};

// Load courses on home page
async function loadCourses() {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;

    try {
        const response = await api.getCourses();
        const courses = response.data;

        if (courses.length === 0) {
            grid.innerHTML = '<p class="loading">No courses available yet.</p>';
            return;
        }

        grid.innerHTML = courses.map(course => createCourseCard(course)).join('');
    } catch (error) {
        grid.innerHTML = `<p class="loading">Failed to load courses: ${error.message}</p>`;
    }
}

function createCourseCard(course) {
    const icon = languageIcons[course.language] || languageIcons.default;
    const difficulty = difficultyLabels[course.difficulty] || difficultyLabels.beginner;
    
    const progressHtml = course.progress ? `
        <div class="course-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${course.progress.percentage}%"></div>
            </div>
            <span class="progress-text">${course.progress.completed}/${course.progress.total} levels completed</span>
        </div>
    ` : '';

    return `
        <div class="course-card">
            <div class="course-header">
                <div class="course-icon">${icon}</div>
                <div class="course-info">
                    <h3>${course.title}</h3>
                    <div class="course-meta">
                        <span>${difficulty.text}</span>
                        <span>•</span>
                        <span>${course.total_levels || 0} levels</span>
                    </div>
                </div>
            </div>
            <p class="course-description">${course.description || ''}</p>
            ${progressHtml}
            <div class="course-footer">
                <a href="/course.html?id=${course.id}" class="btn btn-primary">
                    ${course.progress ? 'Continue' : 'Start Learning'}
                </a>
            </div>
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
});
