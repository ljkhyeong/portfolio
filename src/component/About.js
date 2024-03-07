const About = () => {
  return (
    <>
      <div className="details">
        <div className="section">
          <div className="section__title">About Me</div>
          <div className="section__list">
            <div className="section__list-item">
              <div className="text">
                · 개발 과정에서 항상 사용자의 입장을 생각하며, 팀원들에게 누가
                되지 않도록 성실하고 열심히 임합니다.
              </div>
              <div className="text">
                · 기존에 배웠던 것을 잘 활용하고 새로운 기능을 능숙히 배우기
                위해 CS 관련 서적을 꾸준히 읽습니다.
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section__title">Educated & Activities</div>
          <div className="section__list">
            <div className="section__list-item">
              <div className="left">
                <div className="name">충주중산고등학교 졸업</div>
                <div className="duration">2012.03 - 2015.02</div>
                <div className="name">경상국립대학교 정보통신공학과 중퇴</div>
                <div className="duration">2015.03 - 2019.12</div>
                <div className="name">인천대학교 정보통신공학과 학사</div>
                <div className="duration">2020.03 - 2022.08</div>
              </div>
              <div className="right">
                <div className="name">카카오 클라우드 스쿨 개발자 과정 3기</div>
                <div className="desc">2023.05 - 2023.11</div>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section__title">Skill</div>
          <div className="section__list">
            <div className="section__list-item">
              <div className="left">
                <div className="name">능숙한</div>
                <div>
                  <span className="addr-line">Language</span>
                  <span className="addr"> - Java,JavaScript</span>
                </div>
                <div>
                  <span className="addr-line">Frontend</span>
                  <span className="addr"> - React</span>
                </div>
                <div>
                  <span className="addr-line">Backend</span>
                  <span className="addr"> - Spring, Hibernate</span>
                </div>
                <div>
                  <span className="addr-line">RDBMS</span>
                  <span className="addr"> - MySQL,MariaDB</span>
                </div>
                <div>
                  <span className="addr-line">Infra</span>
                  <span className="addr"> - Docker</span>
                </div>
                <div>
                  <span className="addr-line">SCM</span>
                  <span className="addr"> - Git</span>
                </div>
              </div>
              <div className="right">
                <div className="name">알고 있는</div>
                <div>
                  <span className="addr-line">Language</span>
                  <span className="addr"> - C, Go, Python</span>
                </div>
                <div>
                  <span className="addr-line">Backend</span>
                  <span className="addr"> - Node.js </span>
                </div>
                <div>
                  <span className="addr-line">Infra</span>
                  <span className="addr"> - Kubernetes, AWS</span>
                </div>
                <div>
                  <span className="addr-line">SCM</span>
                  <span className="addr"> - Jira, Notion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section__title">Projects</div>
          <div className="section__list">
            <div className="section__list-item">
              <div className="name">WebRTC/HLS 현장강의 보조 서비스 (Team)</div>
              <div className="text">
                현장강의를 위해 WebRTC로 지연을 줄이고 HLS로 되감기를 추가한다는
                아이디어에서 진행된 프로젝트입니다. WebRTC, HLS 플레이어를
                실시간 전환하여 놓친 부분을 다시 듣다가 돌아올 수 있으며 강의실
                별 실시간 채팅, 질의응답, 파일 송수신이 가능합니다.
              </div>
            </div>
            <div className="section__list-item">
              <div className="name">205번가 (Team)</div>
              <div className="text">
                스프링/thymeleaf로 구현한 간단한 쇼핑몰입니다. 팀원들의 스프링
                공부용도로 짧은 시간 진행된 프로젝트라 필요기능 구현도가
                낮습니다. 개인 프로젝트 마무리 후 유지보수 예정입니다.
              </div>
            </div>
            <div className="section__list-item">
              <div className="name">Soccer-Fan-Board (Personal)</div>
              <div className="text">
                해외축구 입문자들을 위해 관심있는 팀의 문서, 선수단 정보, 경기
                일정 정보, 커뮤니티 게시판을 제공하는 프로젝트입니다. 개발
                현재진행/배포 중인 프로젝트입니다.
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section__title">Certifications</div>
          <div className="skills">
            <div className="skills__item">
              <div className="left">
                <div class="name">정보처리기사</div>
                <div className="name">네트워크관리사 2급</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
