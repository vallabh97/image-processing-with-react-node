import styled from "styled-components";

export const Image = styled.img`
  width: 100%;
  height: auto;
  cursor: ${(props) => props.cursor ? props.cursor : 'default'}
`;