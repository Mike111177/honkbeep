import * as Api from "../../../client/Api";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";

export type LoggedInGuardProps = { children: JSX.Element };
export default function LoggedInGuard({ children }: LoggedInGuardProps) {
  const history = useHistory();
  const [show, setShow] = useState(false);
  useEffect(() => {
    Api.me().then((result) => {
      if (result.user === undefined) {
        history.push("/login");
      } else {
        setShow(true);
      }
    });
  }, [history]);
  return show ? children : <></>;
}
