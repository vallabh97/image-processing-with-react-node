import styled from "styled-components";

export const GridContainer = styled.div`
  display: grid;
  place-items: center;
  height: ${(props) => (props.height ? props.height : "auto")};
  width: ${(props) => (props.width ? props.width : "auto")};
  position: ${props => props.position ? props.position : 'unset'};
`;