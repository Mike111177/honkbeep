import { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router";
import { TableStyles as styles } from ".";
import {
  TableMessage,
  TableMessageType,
  TableState,
} from "honkbeep-protocol/types/TableMessage";
import { User } from "honkbeep-protocol/types/User";
import * as Api from "../../Api";
import BoxButton from "honkbeep-react/components/BoxButton";
import { classNames, useQuery } from "honkbeep-react/util";

type TableComponentState = { starting: boolean; id: string } & TableState;

const initialTableState: TableComponentState = {
  players: [],
  leader: 0,
  starting: false,
  id: "",
};

function TableReducer(
  state: TableComponentState,
  message: TableMessage
): TableComponentState {
  switch (message.type) {
    case TableMessageType.TableUpdate:
      return { ...state, ...message.state };
    case TableMessageType.GameStartNotification:
      return { ...state, starting: true, id: message.gameid };
    default:
      throw new Error();
  }
}

export default function Table() {
  const history = useHistory();
  const id = useQuery().get("id")!;
  const [meUser, setMeUser] = useState<User | undefined>();
  const [state, dispatch] = useReducer(TableReducer, initialTableState);
  const [sendMessage, setSendMessage] = useState<(msg: TableMessage) => void>();
  useEffect(() => {
    const ws = Api.joinTable(id);
    ws.onmessage = dispatch;
    Api.me().then((response) => setMeUser(response?.user));
    setSendMessage(() => (msg: TableMessage) => ws.send(msg));
    return () => ws.close();
  }, [id]);
  useEffect(() => {
    if (state.starting) {
      history.push(`/game?id=${state.id}`);
    }
  }, [history, state.id, state.starting]);
  return (
    <div className={styles.Table}>
      {state.players.map(({ name, id }, i) => (
        <div key={i}>
          <span
            className={classNames(
              styles.TableName,
              styles.TableLeaderName,
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
            sendMessage!({ type: TableMessageType.TableStartRequest });
          }}
        >
          Start
        </BoxButton>
      ) : undefined}
    </div>
  );
}
