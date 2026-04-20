import styled from "styled-components";

const Footer = () => {
  return (
    <FooterWrap>
      <FooterInner>
        <FooterLink>회사소개</FooterLink>
        <Divider>|</Divider>
        <FooterLink>이용약관</FooterLink>
        <Divider>|</Divider>
        <FooterLink>개인정보처리방침</FooterLink>
        <Divider>|</Divider>
        <span>
          고객센터: <EmailLink>support@404.com</EmailLink>
        </span>
      </FooterInner>
    </FooterWrap>
  );
};

export default Footer;

// ─── 스타일 ──────────────────────────────────────────────────
const FooterWrap = styled.footer`
  background: #fff;

  padding: 20px 24px;
  margin-top: auto;
`;

const FooterInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #888888;
`;

const FooterLink = styled.span`
  cursor: pointer;
  &:hover {
    color: #ffffff;
  }
`;

const Divider = styled.span`
  color: #555555;
`;

const EmailLink = styled.span`
  color: #1d6bf3;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
