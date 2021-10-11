import { Overlay } from "./Overlay";
import BeatLoader from "react-spinners/BeatLoader";
import { GridContainer } from "./GridContainer";

export default function PageLoader(props) {
  const size = props.size || 20;

  return (
    <GridContainer height="100%" width="100%">
      <Overlay />
      <BeatLoader color="#000" size={size} />
    </GridContainer>
  );
}