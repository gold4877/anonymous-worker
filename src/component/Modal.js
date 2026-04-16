import React from "react";
import styled from "styled-components";

const ModalStyle = styled.div`
  .modal {
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: #1a1a1a;
  }

  .openModal {
    display: flex;
    align-items: center;
    /* 팝업이 열릴때 스르륵 열리는 효과 */
    animation: modal-bg-show 0.8s;
  }

  section {
    width: 90%;
    max-width: 450px;
    margin: 0 auto;
    border-radius: 0.3rem;
    background-color: #fff;
    /* 팝업이 열릴때 스르륵 열리는 효과 */
    animation: modal-show 0.3s;
    overflow: hidden;

    header {
      position: relative;
      padding: 8px 40px 0 16px;
      background-color: #ffffff;
      height: 32px; //
      button {
        position: absolute;
        top: 4px;
        right: 8px;

        border: none;
        background-color: transparent;
        color: #999999;
        font-size: 20px;
        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;

        transition: all 0.2s ease;
        &:hover {
          color: #1a1a1a;
        }
      }
    }
    main {
      padding: 16px;
      border-bottom: 1px solid #f5f5f5;
      border-top: 1px solid #f5f5f5;
    }
    footer {
      padding: 12px 16px;
      text-align: right;
      button {
        padding: 6px 12px;
        color: #fff;
        background-color: #999999;
        border-radius: 5px;
        font-size: 13px;
      }
    }
  }

  @keyframes modal-show {
    from {
      opacity: 0;
      margin-top: -50px;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
  @keyframes modal-bg-show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// const Button = styled.button`
//   outline: none;
//   cursor: pointer;
//   margin-right: 10px;
//   border: 0;
//   width: 60px;
// `;

const Modal = (props) => {
  const { open, close, header, children } = props;

  return (
    <ModalStyle>
      <div className={open ? "openModal modal" : "modal"}>
        {open && (
          <section>
            <header>
              {header}
              <button onClick={close}>&times;</button>
            </header>
            <main>{children}</main>
          </section>
        )}
      </div>
    </ModalStyle>
  );
};
export default Modal;
