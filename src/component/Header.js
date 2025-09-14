const Header = () => {
  return (
    <div className="header">
      <div className="full-name">
        <span className="first-name">임정규</span>
        <span className="last-name">의 포트폴리오</span>
      </div>
      <div className="contact-info">
        <span className="email">Email: </span>
        <span className="email-val">jolri24@naver.com</span>
        <span className="separator"></span>
        <span className="phone">Phone: </span>
        <span className="phone-val">010-3972-6284</span>
        <span className="separator"></span>
        <span className="phone">GITHUB: </span>
        <span className="phone-val">
          <a href="https://github.com/ljkhyeong">github.com/ljkhyeong</a>
        </span>
      </div>
      <div className="about">
        <span className="position">Web Developer </span>
        <span className="desc">
          사람들에게는 편의를, 서버에게는 안정을 주는 것이 낙입니다.
        </span>
      </div>
    </div>
  );
};

export default Header;
