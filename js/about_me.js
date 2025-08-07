// /js/about_me.js

document.addEventListener('DOMContentLoaded', function() {
    // 滚动动画
    const animatedElements = [
        ...document.querySelectorAll('.card'),
        ...document.querySelectorAll('h1, h2'),
        ...document.querySelectorAll('.profile-header'),
        ...document.querySelectorAll('.social-links a'),
        ...document.querySelectorAll('.skill-tag'),
        ...document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form button')
    ];
    
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
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // 表单提交处理
    document.querySelector('.contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 创建成功消息元素
        const successMessage = document.createElement('div');
        successMessage.style.backgroundColor = 'var(--primary-color)';
        successMessage.style.color = 'white';
        successMessage.style.padding = '15px';
        successMessage.style.borderRadius = '8px';
        successMessage.style.marginTop = '20px';
        successMessage.style.textAlign = 'center';
        successMessage.style.animation = 'fadeIn 0.5s ease-out';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> 消息已发送！';
        
        this.appendChild(successMessage);
        
        // 3秒后移除消息
        setTimeout(() => {
            successMessage.remove();
            this.reset();
        }, 3000);
    });
});