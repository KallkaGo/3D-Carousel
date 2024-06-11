import styled from "styled-components";

export const GameWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .container{
    margin-top:450px;
  }

  .imgContainer {
    display: flex;
    justify-content: center;
    margin-bottom:100px;
    & img {
      width: 800px;
      height: 450px;
      opacity: 0;
    }

    &:last-child{
      margin-bottom:450px;
    }
  }
`;
