import styled from "styled-components";

export const Button = styled.button`
  background: ${(props) => (props.background ? props.background : "#000")};
  color: ${(props) => (props.color ? props.color : "#fff")};
  border: ${(props) => (props.border ? props.border : "none")};
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "40px")};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "3px"};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "18px")};
  padding: ${(props) => (props.padding ? props.padding : "10px")};
  cursor: pointer;
  font-family: Roboto-light;

  &:disabled {
    opacity: 0.7;
  }
`;