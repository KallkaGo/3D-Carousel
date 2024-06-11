import styled from "styled-components";

export const GameWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .imgContainer {
    display: flex;
    justify-content: center;
    margin-bottom:64px;
    & img {
      width: 800px;
      height: 450px;
      opacity: 0;
    }
  }
`;
