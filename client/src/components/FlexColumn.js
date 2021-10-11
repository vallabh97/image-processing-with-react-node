import styled from "styled-components";

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.alignItems ? props.alignItems : 'flex-start'};
`;