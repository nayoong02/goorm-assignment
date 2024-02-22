// Github API 요청하는 클래스
class Github {
    constructor() {
      this.base_url = 'https://api.github.com/users/'; // Github 사용자의 기본 URL 설정
    }
  
    async getUser(username) {
        const profileResponse = await fetch(`${this.base_url}${username}`); // 프로필 정보 가져오기
        const profile = await profileResponse.json();

        const reposResponse = await fetch(`${this.base_url}${username}/repos`); // 레포 정보 가져오기
        const repos = await reposResponse.json();

        return {profile, repos}; // 프로필, 레포 정보 객체 형태로 반환
    }
}

// UI 업데이트하는 클래스
class UI {
    // 프로필 정보 
    showProfile(user) {
        // Github 잔디밭 이미지 URL
        const grassURL = `https://ghchart.rshah.org/${user.login}`;

        const profileHTML = `
            <div class="card card-body mb-3">
                <div class="row align-items-center">
                    <div class="col-md-3 d-flex align-items-center flex-column">
                        <img class="img-fluid mb-2" src="${user.avatar_url}">
                        <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
                    </div>
                    <div class="col-md-9">
                        <!-- 버튼들 --> 
                        <span class="badge bg-primary" style="color: white; padding: 10px 20px;">Public Repos: ${user.public_repos}</span>
                        <span class="badge bg-secondary" style="color: white; padding: 10px 20px;">Public Gists: ${user.public_gists}</span>
                        <span class="badge bg-success" style="color: white; padding: 10px 20px;">Followers: ${user.followers}</span>
                        <span class="badge bg-info" style="color: white; padding: 10px 20px;">Following: ${user.following}</span>
                        <br><br>
                        <!-- 사용자 정보 -->
                        <ul class="list-group">
                            <li class="list-group-item">Company: ${user.company}</li>
                            <li class="list-group-item">Website/Blog: ${user.blog}</li>
                            <li class="list-group-item">Location: ${user.location}</li>
                            <li class="list-group-item">Member Since: ${user.created_at}</li>
                        </ul>
                        <!-- 잔디 이미지 --> 
                        <div class="mt-3">
                            <h3 class="page-heading mb-3">Github Contributions</h3>
                            <img src="${grassURL}" alt="Github Contributions Chart" class="img-fluid">
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('profile').innerHTML = profileHTML;
    }

    // 레포 정보 
    showRepos(repos) {
        let reposHTML = '<h3 class="page-heading mb-3">Latest Repos</h3>';

        repos.forEach(repo => {
            reposHTML += `
                <div class="card card-body mb-2">
                    <div class="row">
                        <div class="col-md-6">
                            <a href="${repo.html_url}" style="font-size: 20px;" target="_blank">${repo.name}</a>
                        </div>
                        <div class="col-md-6">
                            <span class="badge bg-primary" style="color: white; padding: 10px 20px;">Stars: ${repo.stargazers_count}</span>
                            <span class="badge bg-secondary" style="color: white; padding: 10px 20px;">Watchers: ${repo.watchers_count}</span>
                            <span class="badge bg-success" style="color: white; padding: 10px 20px;">Forks: ${repo.forks_count}</span>
                        </div>
                    </div>
                </div>`;
        });
        document.getElementById('profile').innerHTML += reposHTML;
    }

    // 경고 메시지 
    showAlert(message, className) {
        // 이전에 존재하는 경고 메시지 제거
        this.clearAlert();
    
        // 경고 메시지 생성
        const div = document.createElement('div');
        div.className = className;
        div.appendChild(document.createTextNode(message));
    
        // 경고 메시지를 페이지에 추가
        const container = document.querySelector('.searchContainer');
        const search = document.querySelector('.search');
        container.insertBefore(div, search);
    
        // 3초 후 경고 메시지 제거
        setTimeout(() => {
            this.clearAlert();
        }, 3000);
    }
    
    // 경고 메시지 제거 
    clearAlert() {
        const currentAlert = document.querySelector('.alert');

        if (currentAlert) {
            currentAlert.remove();
        }
    }

    // 검색 결과 제거 
    clearProfile() {
        document.getElementById('profile').innerHTML = '';
    }
}

// Github 클래스 인스턴스 생성
const github = new Github();

// UI 클래스 인스턴스 생성
const ui = new UI(); 

// 사용자가 키보드 입력 시, 함수 실행
searchUser.addEventListener('keyup', e => {

    // 사용자가 입력한 텍스트 가져오기
    const userText = document.getElementById('searchUser').value;
    
    if (userText !== '') { // 빈 문자열인지 확인
        github.getUser(userText) // github 클래스의 getUser 메소드
            .then(data => {
                if (data.profile.message === 'Not Found') { // UI에서 사용자가 발견되지 않았다는 메시지 표시
                    ui.showAlert('User not found !', 'alert alert-danger'); // 경고 메시지 표시
                } else { 
                    console.log(data);
                    ui.showProfile(data.profile); // 사용자 프로필 정보 표시
                    ui.showRepos(data.repos); // 사용자 레포지토리 정보 표시
                }
            });
    }
    else { // 빈 문자열이면 프로필 정보 지우기
        ui.clearProfile(); 
    }
});
