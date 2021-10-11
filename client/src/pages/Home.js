import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { FlexColumn } from "../components/FlexColumn";
import { GridContainer } from "../components/GridContainer";
import styled from "styled-components";

const LinksContainer = styled.div`
  margin: 30px 0;
  height: 105px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LinkButton = styled(Button)`
  width: 250px;
`;

const SelectImage = styled.div`
  font-size: 25px;
  font-family: Roboto-medium;
`;

export default function Home() {
  return (
    <Container height="100%">
      <GridContainer height="100%" width="100%">
        <FlexColumn alignItems="center">
          <SelectImage>Select an image to edit...</SelectImage>

          <LinksContainer>
            <Link to="/search-image">
              <LinkButton>Search image online</LinkButton>
            </Link>
            <Link to="upload-image">
              <LinkButton>Upload image from device</LinkButton>
            </Link>
          </LinksContainer>
        </FlexColumn>
      </GridContainer>
    </Container>
  );
}