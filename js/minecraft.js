document.addEventListener('DOMContentLoaded', function() {
    // 滚动动画
    const animatedElements = [
        document.querySelector('h1'),
        ...document.querySelectorAll('.card'),
        ...document.querySelectorAll('h2')
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
});