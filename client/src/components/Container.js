import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: ${props => props.direction ? props.direction : 'row'};
  align-items: ${props => props.alignItems ? props.alignItems : 'flex-start'};
  height: ${props => props.height ? props.height : 'auto'};
`;