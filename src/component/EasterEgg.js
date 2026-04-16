import { useState, useEffect } from "react";
import styled from "styled-components";

// 모달 배경
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 9999;
`;

// 모달 콘텐츠
const ModalContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f5f5;
  border-radius: 0;
  box-shadow: none;
  width: 100%;
  height: 100%;
  overflow: auto;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// 이미지
const Image = styled.img`
  display: block;
  max-width: 95%;
  max-height: 95%;
  object-fit: contain;
`;

function EasterEgg() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastEscTime, setLastEscTime] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // ESC 키로 닫기
      if ((event.key === "Escape" || event.keyCode === 27) && isOpen) {
        setIsOpen(false);
        return;
      }

      // ESC 키 감지 (키 코드: 27 또는 'Escape')
      if (event.key === "Escape" || event.keyCode === 27) {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastEscTime;

        // 500ms 이내에 두 번 눌렸는지 확인
        if (timeDiff < 500 && timeDiff > 0) {
          setIsOpen(true);
          setLastEscTime(0); // 초기화
        } else {
          setLastEscTime(currentTime);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lastEscTime, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  // 모달 배경 클릭시 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      {isOpen && (
        <ModalOverlay onClick={handleClose}>
          <ModalContent onClick={handleClose}>
            <Image
              src={require("../assets/excel.png")}
              alt="Easter Egg Excel"
              onClick={(e) => e.stopPropagation()}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

export default EasterEgg;
