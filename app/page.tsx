import { redirectIfAuthenticated } from "./auth-page/helpers";
import { LogIn } from "./auth-page/login";

export default async function Home() {
  await redirectIfAuthenticated();
  return (
    <main>
      <LogIn isDevMode={process.env.NODE_ENV === "development"} />
    </main>
  );
}
