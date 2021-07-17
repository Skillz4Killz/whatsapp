import styled from "styled-components";
import { Button } from "@material-ui/core";

export const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
