import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: "Pretendard", -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #1a1a1a;
    background-color: #f5f5f5;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol, li {
    list-style: none;
  }

  img {
    max-width: 100%;
    display: block;
  }
`;

export default GlobalStyle;
