import { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router";
import { LobbyStyles as styles } from ".";
import {
  LobbyMessage,
  LobbyMessageType,
  LobbyState,
} from "../../../backend/types/LobbyMessage";
import { User } from "../../../backend/types/User";
import * as Api from "../../../client/Api";
import BoxButton from "../../components/BoxButton";
import { classNames } from "../../util";

type LobbyComponentState = { starting: boolean } & LobbyState;

const initialLobbyState: LobbyComponentState = {
  players: [],
  leader: 0,
  starting: false,
};

function LobbyReducer(
  state: LobbyComponentState,
  message: LobbyMessage
): LobbyComponentState {
  switch (message.type) {
    case LobbyMessageType.LobbyUpdate:
      return { ...state, ...message.state };
    case LobbyMessageType.GameStartNotification:
      return { ...state, starting: true };
    default:
      throw new Error();
  }
}

export default function Lobby() {
  const history = useHistory();
  const [meUser, setMeUser] = useState<User | undefined>();
  const [state, dispatch] = useReducer(LobbyReducer, initialLobbyState);
  const [sendMessage, setSendMessage] = useState<(msg: LobbyMessage) => void>();
  useEffect(() => {
    const ws = Api.lobby();
    ws.onmessage = dispatch;
    Api.me().then(({ user }) => setMeUser(user));
    setSendMessage(() => (msg: LobbyMessage) => ws.send(msg));
    return () => ws.close();
  }, []);
  useEffect(() => {
    if (state.starting) {
      history.push("/game");
    }
  }, [history, state.starting]);
  return (
    <div className={styles.Lobby}>
      {state.players.map(({ name, id }, i) => (
        <div key={i}>
          <span
            className={classNames(
              styles.LobbyName,
              styles.LobbyLeaderName,
              id === state.leader
            )}
          >
            {name}
          </span>
          <br />
        </div>
      ))}
      {meUser?.id === state.leader ? (
        <BoxButton
          onClick={() => {
            sendMessage!({ type: LobbyMessageType.LobbyStartRequest });
          }}
        >
          Start
        </BoxButton>
      ) : undefined}
    </div>
  );
}
