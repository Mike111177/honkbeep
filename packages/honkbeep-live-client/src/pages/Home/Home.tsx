import * as Api from "../../Api";
import { useHistory } from "react-router-dom";
import { HomeStyles as styles } from ".";
import BoxButton from "honkbeep-react/components/BoxButton";
import { useEffect, useState } from "react";
import { TableState } from "honkbeep-protocol/types/TableMessage";

export default function Home() {
  const history = useHistory();
  const [tables, setTables] = useState<
    {
      id: string;
      state: TableState;
    }[]
  >([]);
  useEffect(() => {
    async function updateList() {
      const tables = await Api.listTables();
      setTables(tables);
    }
    updateList();
    const interval = setInterval(updateList, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={styles.Home}>
      <BoxButton
        onClick={async (e) => {
          const tableID = await Api.createTable();
          history.push(`/table?id=${tableID}`);
        }}
      >
        Create Table
      </BoxButton>

      <table className={styles.TableTable}>
        <thead>
          <tr>
            <td>Leader</td>
            <td>Players</td>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.id}>
              <td>
                {
                  table.state.players.find(
                    ({ id }) => id === table.state.leader
                  )?.name
                }
              </td>
              <td>
                {table.state.players.map((player) => player.name).join(", ")}
              </td>

              <td>
                <BoxButton
                  onClick={() => {
                    history.push(`/table?id=${table.id}`);
                  }}
                >
                  Join Table
                </BoxButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <BoxButton
        className={styles.CreateButtons}
        onClick={() => {
          history.push("/solitaire");
        }}
      >
        Play Solitaire
      </BoxButton>
      <BoxButton
        className={styles.CreateButtons}
        onClick={() => {
          history.push("/splitscreen");
        }}
      >
        Play 4 Player splitscreen
      </BoxButton>
    </div>
  );
}
