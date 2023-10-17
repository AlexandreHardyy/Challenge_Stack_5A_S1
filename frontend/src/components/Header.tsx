import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/Mode-toggle.tsx";

const Header = () => {
  return (
    <header className="flex px-8 py-4 items-center justify-between sticky top-0 bg-background drop-shadow-md z-50">
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
        <ModeToggle />
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
