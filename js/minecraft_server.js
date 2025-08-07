// 复制服务器地址功能
const joinButton = document.querySelector('.join-button');
const serverIp = document.querySelector('.server-ip');

joinButton.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(serverIp.textContent.trim())
        .then(() => {
            const originalText = joinButton.textContent;
            joinButton.textContent = '已复制!';
            setTimeout(() => {
                joinButton.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('复制失败: ', err);
        });
});