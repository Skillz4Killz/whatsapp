import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../utils/firebase";
import { Reciever, Sender, Timestamp } from "./styled/MessageElement";

type Props = {
  user: unknown;
  message: {
    message: string;
    timestamp: number;
  };
};
export default function Message(props: Props) {
  const [user] = useAuthState(auth);

  const MessageVariant = props.user === user.email ? Sender : Reciever;

  return (
    <div>
      <MessageVariant>
        {props.message.message}
        <Timestamp>
          {props.message.timestamp
            ? moment(props.message.timestamp).format("LT")
            : "..."}
        </Timestamp>
      </MessageVariant>
    </div>
  );
}
