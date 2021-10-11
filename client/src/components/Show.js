import styled from "styled-components"

export const Show = styled.div`
  display: ${props => props.show ? 'initial' : 'none'};
`;