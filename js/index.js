// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {

    // 1. 标签页切换功能
    const tabs = document.querySelectorAll('.category-tab');
    const tabContents = document.querySelectorAll('.category-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有active类
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 添加当前active类
            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
    });

    // 2. 滚动动画效果
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.card, h1, h2, .profile-section, .btn, .stat-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    };
    animateOnScroll();

    // 3. 表单提交处理（如果有表单的话）
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = '<i class="fas fa-check-circle"></i> 消息已发送！';
            
            this.appendChild(successMessage);
            setTimeout(() => successMessage.remove(), 3000);
            this.reset();
        });
    }

    // 4. 返回按钮效果（如果有返回按钮的话）
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = this.getAttribute('href');
        });
    }
});