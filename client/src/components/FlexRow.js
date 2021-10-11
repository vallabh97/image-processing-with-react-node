import styled from "styled-components";

export const FlexRow = styled.div`
  display: flex;
  width: ${props => props.width ? props.width : 'auto'};
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
`;