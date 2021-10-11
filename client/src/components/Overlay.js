import styled from "styled-components";

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #fff;
  opacity: ${props => props.opacity ? props.opacity : 0};
`;