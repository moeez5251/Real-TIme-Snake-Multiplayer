import React from "react";
import styled from "styled-components";

interface LoaderProps {
  text?: string;       // Loader text
  color?: string;      // Loader color
}

const Loader: React.FC<LoaderProps> = ({ text = "Loading...", color = "#0ddff2" }) => {
  return (
    <StyledWrapper color={color}>
      <div className="loader" />
      <p className="loader-text">{text}</p>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ color: string }>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);

  .loader {
    --s: 20px;
    width: calc(var(--s) * 2.33);
    aspect-ratio: 1;
    display: flex;
    justify-content: space-between;
  }

  .loader::before,
  .loader::after {
    content: "";
    width: var(--s);
    --_g: no-repeat radial-gradient(farthest-side, ${(props) => props.color} 94%, #0000);
    background: var(--_g) top, var(--_g) bottom;
    background-size: 100% var(--s);
    transform-origin: 50% calc(100% - var(--s) / 2);
    animation: l30 1s infinite;
  }

  .loader::after {
    transform-origin: 50% calc(var(--s) / 2);
  }

  @keyframes l30 {
    70%,
    100% {
      transform: rotate(-270deg);
    }
  }

  .loader-text {
    margin-top: 1.5rem;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    font-family: "Space Grotesk", sans-serif;
  }
`;

export default Loader;
