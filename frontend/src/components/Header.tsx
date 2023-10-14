import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex px-8 py-4 items-center justify-between">
      <h1>RodeWise</h1>
      <div className="flex gap-8">
        <Button variant="ghost" asChild>
          <Link to="/#">Services</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/#">FAQ</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/#">About us</Link>
        </Button>
      </div>
      <div className="flex gap-4">
        <Button variant="secondary" asChild>
          <Link to="/register">Sign up</Link>
        </Button>
        <Button asChild>
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
