import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthProvider";

type LocationState = { from: { pathname: string | undefined } };

export const LoginPage = () => {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();
  const [searchParams] = useSearchParams();
  const qrcode = searchParams.get("qrcode");

  let from = useMemo(
    () => (location.state as LocationState)?.from?.pathname || "/",
    [location.state]
  );

  useEffect(() => {
    if (auth.user) navigate("/");
  }, [auth.user, navigate]);

  const handleSubmit = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      auth.signin(() => {
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        navigate(from, { replace: true });
      });
    },
    [auth, from, navigate]
  );

  return (
    <div className="popup-container">
      {auth.loading && <h1>Loading...</h1>}
      <h1>{qrcode ? "Scan" : ""}</h1>
      {!qrcode && <button onClick={handleSubmit}>LOGIN</button>}
      {qrcode && <img alt="qrcode" src={qrcode} />}
    </div>
  );
};
