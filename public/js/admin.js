// Admin Panel JavaScript

let currentCourseId = null;
let currentLevelId = null;

// Check admin access
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
        alert('Admin access required');
        window.location.href = '/';
        return;
    }
    
    document.getElementById('adminName').textContent = user.username;
    
    // Initialize
    setupNavigation();
    setupForms();
    setupTabs();
    loadDashboard();
});

// Navigation
function setupNavigation() {
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
        });
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });
}

function showSection(section) {
    // Update nav
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === section);
    });
    
    // Update sections
    document.querySelectorAll('.admin-section').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');
    
    // Load data
    switch (section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'courses':
            loadCourses();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

// Dashboard
async function loadDashboard() {
    try {
        const data = await api.get('/admin/dashboard');
        
        const stats = data.data.stats;
        document.getElementById('totalUsers').textContent = stats.total_users;
        document.getElementById('totalCourses').textContent = stats.total_courses;
        document.getElementById('totalLevels').textContent = stats.total_levels;
        document.getElementById('totalSubmissions').textContent = stats.total_submissions;
        document.getElementById('correctSubmissions').textContent = stats.correct_submissions;
        document.getElementById('newUsersWeek').textContent = stats.new_users_week;
        
        // Recent submissions
        const tbody = document.querySelector('#recentSubmissionsTable tbody');
        tbody.innerHTML = data.data.recentSubmissions.map(sub => `
            <tr>
                <td>${sub.username}</td>
                <td>${sub.level_title}</td>
                <td class="${sub.is_correct ? 'status-correct' : 'status-wrong'}">
                    ${sub.status}
                </td>
                <td>${new Date(sub.created_at).toLocaleString()}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Courses
async function loadCourses() {
    try {
        const data = await api.get('/admin/courses');
        const list = document.getElementById('coursesList');
        
        list.innerHTML = data.data.map(course => `
            <div class="course-card-admin" onclick="editCourse('${course.id}')">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <h3>${course.title}</h3>
                    <span class="badge ${course.is_published ? 'badge-published' : 'badge-draft'}">
                        ${course.is_published ? 'Published' : 'Draft'}
                    </span>
                </div>
                <div class="course-meta">
                    <span>📝 ${course.language}</span>
                    <span>⭐ ${course.difficulty}</span>
                </div>
                <p style="color: #a0a0a0; font-size: 0.9rem; margin-bottom: 15px;">
                    ${course.description || 'No description'}
                </p>
                <div class="course-stats">
                    <span>📚 ${course.total_levels} levels</span>
                    <span>👥 ${course.enrolled_users} users</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function editCourse(courseId) {
    currentCourseId = courseId;
    
    try {
        const data = await api.get(`/admin/courses/${courseId}`);
        const course = data.data;
        
        document.getElementById('courseEditorTitle').textContent = `Edit: ${course.title}`;
        document.getElementById('courseId').value = course.id;
        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseDescription').value = course.description || '';
        document.getElementById('courseLanguage').value = course.language;
        document.getElementById('courseDifficulty').value = course.difficulty;
        document.getElementById('coursePublished').checked = course.is_published;
        
        // Load levels
        renderLevels(course.levels || []);
        
        showSection('course-editor');
        document.getElementById('course-editor-section').classList.add('active');
    } catch (error) {
        console.error('Error loading course:', error);
        alert('Error loading course');
    }
}

function renderLevels(levels) {
    const list = document.getElementById('levelsList');
    
    if (levels.length === 0) {
        list.innerHTML = '<p style="color: #a0a0a0; text-align: center;">No levels yet</p>';
        return;
    }
    
    list.innerHTML = levels.map((level, index) => `
        <div class="level-item" onclick="editLevel('${level.id}')">
            <div class="level-order">${index + 1}</div>
            <div class="level-info">
                <h4>${level.title}</h4>
                <span>${level.xp_reward} XP • ${level.challenge_id ? '✓ Has challenge' : '⚠ No challenge'}</span>
            </div>
            <div class="level-actions">
                <button class="btn-icon danger" onclick="event.stopPropagation(); deleteLevel('${level.id}')" title="Delete">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

async function editLevel(levelId) {
    currentLevelId = levelId;
    
    try {
        const data = await api.get(`/admin/levels/${levelId}`);
        const level = data.data;
        
        document.getElementById('levelEditorTitle').textContent = `Edit: ${level.title}`;
        document.getElementById('levelId').value = level.id;
        document.getElementById('levelCourseId').value = level.course_id;
        document.getElementById('levelTitle').value = level.title;
        document.getElementById('levelTheory').value = level.theory_content || '';
        document.getElementById('levelXp').value = level.xp_reward;
        
        // Challenge data
        document.getElementById('challengeDescription').value = level.challenge_description || '';
        document.getElementById('challengeStarterCode').value = level.starter_code || '';
        document.getElementById('challengeLanguage').value = level.language_id || 71;
        document.getElementById('challengeInput').value = level.test_input || '';
        document.getElementById('challengeOutput').value = level.expected_output || '';
        
        showSection('level-editor');
        document.getElementById('level-editor-section').classList.add('active');
    } catch (error) {
        console.error('Error loading level:', error);
        alert('Error loading level');
    }
}

function backToCourseEditor() {
    if (currentCourseId) {
        editCourse(currentCourseId);
    } else {
        showSection('courses');
    }
}

async function deleteLevel(levelId) {
    if (!confirm('Are you sure you want to delete this level?')) return;
    
    try {
        await api.delete(`/admin/levels/${levelId}`);
        editCourse(currentCourseId); // Refresh
    } catch (error) {
        alert('Error deleting level');
    }
}

// Users
async function loadUsers() {
    try {
        const data = await api.get('/admin/users');
        const tbody = document.querySelector('#usersTable tbody');
        
        tbody.innerHTML = data.data.map(user => `
            <tr>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    <select class="role-select" onchange="updateUserRole('${user.id}', this.value)">
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td>${user.xp}</td>
                <td>${user.total_submissions}</td>
                <td>${user.completed_levels}</td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>-</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function updateUserRole(userId, role) {
    try {
        await api.put(`/admin/users/${userId}/role`, { role });
    } catch (error) {
        alert('Error updating role');
        loadUsers(); // Refresh
    }
}

// Forms
function setupForms() {
    // Course form
    document.getElementById('courseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const courseId = document.getElementById('courseId').value;
        const data = {
            title: document.getElementById('courseTitle').value,
            description: document.getElementById('courseDescription').value,
            language: document.getElementById('courseLanguage').value,
            difficulty: document.getElementById('courseDifficulty').value,
            is_published: document.getElementById('coursePublished').checked
        };
        
        try {
            await api.put(`/admin/courses/${courseId}`, data);
            alert('Course saved!');
        } catch (error) {
            alert('Error saving course');
        }
    });
    
    // New course form
    document.getElementById('newCourseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            title: document.getElementById('newCourseTitle').value,
            description: document.getElementById('newCourseDescription').value,
            language: document.getElementById('newCourseLanguage').value,
            difficulty: document.getElementById('newCourseDifficulty').value
        };
        
        try {
            const result = await api.post('/admin/courses', data);
            closeCourseModal();
            editCourse(result.data.id);
        } catch (error) {
            alert('Error creating course');
        }
    });
    
    // Level form
    document.getElementById('levelForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const levelId = document.getElementById('levelId').value;
        const data = {
            title: document.getElementById('levelTitle').value,
            theory_content: document.getElementById('levelTheory').value,
            xp_reward: parseInt(document.getElementById('levelXp').value)
        };
        
        try {
            await api.put(`/admin/levels/${levelId}`, data);
            alert('Level saved!');
        } catch (error) {
            alert('Error saving level');
        }
    });
    
    // New level form
    document.getElementById('newLevelForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            course_id: currentCourseId,
            title: document.getElementById('newLevelTitle').value,
            xp_reward: parseInt(document.getElementById('newLevelXp').value)
        };
        
        try {
            const result = await api.post('/admin/levels', data);
            closeLevelModal();
            editLevel(result.data.id);
        } catch (error) {
            alert('Error creating level');
        }
    });
    
    // Challenge form
    document.getElementById('challengeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const levelId = document.getElementById('levelId').value;
        const data = {
            description: document.getElementById('challengeDescription').value,
            starter_code: document.getElementById('challengeStarterCode').value,
            language_id: parseInt(document.getElementById('challengeLanguage').value),
            test_input: document.getElementById('challengeInput').value,
            expected_output: document.getElementById('challengeOutput').value
        };
        
        try {
            await api.put(`/admin/levels/${levelId}/challenge`, data);
            alert('Challenge saved!');
        } catch (error) {
            alert('Error saving challenge');
        }
    });
}

// Tabs
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
}

// Modals
function showCourseModal() {
    document.getElementById('newCourseForm').reset();
    document.getElementById('courseModal').classList.add('active');
}

function closeCourseModal() {
    document.getElementById('courseModal').classList.remove('active');
}

function showLevelModal() {
    document.getElementById('newLevelForm').reset();
    document.getElementById('levelModal').classList.add('active');
}

function closeLevelModal() {
    document.getElementById('levelModal').classList.remove('active');
}

// Close modals on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
