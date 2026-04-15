import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  max-width: 500px;
  margin: auto;
  .success {
    color: royalblue;
  }
  .error {
    color: red;
  }

  .footer {
    display: flex;
    position: absolute;
    background-color: #ccc;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    color: #222;
    font-size: 0.8em;
    justify-content: center;
    align-items: center;
  }
`;

export const Items = styled.div`
  display: flex;
  align-items: center;

  &.sign {
    font-size: 30px;
    margin-top: 100px;
    margin-bottom: 40px;
    justify-content: center;
  }

  &.item1 {
    margin-top: 100px;
    margin-bottom: 40px;
    justify-content: center;
  }
  &.item2 {
    margin: 10px;
  }
  &.item3 {
    margin-top: 10px;
    margin-left: 40px;
    margin-right: 40px;
    justify-content: space-between;
    color: #999;
    font-size: 14px;
  }
  &.hint {
    margin-top: -5px;
    margin-bottom: 10px;
    margin-right: 40px;
    justify-content: right;
    font-size: 12px;
    color: #999;
  }

  &.signup {
    justify-content: right;
    color: orange;
    font-weight: 700;
    margin-top: 10px;
    margin-right: 40px;
    font-size: 14px;
    .link_style {
      color: orange;
      text-decoration-line: none;
    }
  }
`;
