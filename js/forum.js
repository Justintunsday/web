document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const newPostBtn = document.getElementById('new-post-btn');
    const userGreeting = document.getElementById('user-greeting');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const postModal = document.getElementById('post-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const postForm = document.getElementById('post-form');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const postsContainer = document.getElementById('posts-container');
    const navTabs = document.querySelectorAll('.nav-tab');
    
    // 当前用户状态
    let currentUser = null;
    let currentCategory = 'all';
    
    // 初始化
    checkAuthStatus();
    loadPosts(currentCategory);
    
    // 事件监听器
    loginBtn.addEventListener('click', () => showModal(loginModal));
    registerBtn.addEventListener('click', () => showModal(registerModal));
    logoutBtn.addEventListener('click', logout);
    newPostBtn.addEventListener('click', () => showModal(postModal));
    
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            postModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === registerModal) registerModal.style.display = 'none';
        if (e.target === postModal) postModal.style.display = 'none';
    });
    
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    postForm.addEventListener('submit', handlePostSubmit);
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            loadPosts(currentCategory);
        });
    });
    
    // 函数定义
    function showModal(modal) {
        modal.style.display = 'block';
    }
    
    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/status', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    currentUser = data.user;
                    updateUIForLoggedInUser();
                }
            }
        } catch (error) {
            console.error('检查认证状态失败:', error);
        }
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (response.ok) {
                currentUser = data.user;
                updateUIForLoggedInUser();
                loginModal.style.display = 'none';
                loginForm.reset();
                loginError.textContent = '';
                loadPosts(currentCategory);
            } else {
                loginError.textContent = data.message || '登录失败';
            }
        } catch (error) {
            console.error('登录失败:', error);
            loginError.textContent = '网络错误，请重试';
        }
    }
    
    async function handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        if (password !== confirm) {
            registerError.textContent = '两次输入的密码不一致';
            return;
        }
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (response.ok) {
                currentUser = data.user;
                updateUIForLoggedInUser();
                registerModal.style.display = 'none';
                registerForm.reset();
                registerError.textContent = '';
                loadPosts(currentCategory);
            } else {
                registerError.textContent = data.message || '注册失败';
            }
        } catch (error) {
            console.error('注册失败:', error);
            registerError.textContent = '网络错误，请重试';
        }
    }
    
    async function logout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                currentUser = null;
                updateUIForLoggedOutUser();
                loadPosts(currentCategory);
            }
        } catch (error) {
            console.error('退出失败:', error);
        }
    }
    
    async function loadPosts(category) {
        try {
            const response = await fetch(`/api/posts?category=${category}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const posts = await response.json();
                renderPosts(posts);
            }
        } catch (error) {
            console.error('加载帖子失败:', error);
            postsContainer.innerHTML = '<div class="error-message">加载帖子失败，请刷新页面重试</div>';
        }
    }
    
    function renderPosts(posts) {
        postsContainer.innerHTML = '';
        
        if (posts.length === 0) {
            postsContainer.innerHTML = '<div class="no-posts">暂无帖子</div>';
            return;
        }
        
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            
            const categoryClass = getCategoryClass(post.category);
            
            postCard.innerHTML = `
                <div class="post-header">
                    <h3 class="post-title">${post.title}</h3>
                    <span class="post-category ${categoryClass}">${getCategoryName(post.category)}</span>
                </div>
                <div class="post-meta">
                    <span class="post-author">${post.author.username}</span>
                    <span class="post-date">${formatDate(post.createdAt)}</span>
                </div>
                <div class="post-content">
                    ${post.content}
                </div>
                <div class="post-footer">
                    <div class="post-actions">
                        <div class="post-action">
                            <i class="far fa-thumbs-up"></i>
                            <span>${post.likes || 0}</span>
                        </div>
                        <div class="post-action">
                            <i class="far fa-comment"></i>
                            <span>${post.comments || 0}</span>
                        </div>
                    </div>
                    <div class="post-views">
                        <i class="far fa-eye"></i> ${post.views || 0}
                    </div>
                </div>
            `;
            
            postsContainer.appendChild(postCard);
            
            // 添加点击事件
            postCard.addEventListener('click', () => {
                window.location.href = `/post.html?id=${post._id}`;
            });
        });
    }
    
    async function handlePostSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value;
        
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, category, content }),
                credentials: 'include'
            });
            
            if (response.ok) {
                postModal.style.display = 'none';
                postForm.reset();
                loadPosts(currentCategory);
            }
        } catch (error) {
            console.error('发表帖子失败:', error);
        }
    }
    
    function updateUIForLoggedInUser() {
        userGreeting.textContent = `欢迎, ${currentUser.username}`;
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        newPostBtn.style.display = 'block';
    }
    
    function updateUIForLoggedOutUser() {
        userGreeting.textContent = '欢迎访客';
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        newPostBtn.style.display = 'none';
    }
    
    function getCategoryName(category) {
        const categories = {
            'tech': '技术',
            'life': '生活',
            'qa': '问答',
            'other': '其他'
        };
        return categories[category] || category;
    }
    
    function getCategoryClass(category) {
        return `category-${category}`;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
});