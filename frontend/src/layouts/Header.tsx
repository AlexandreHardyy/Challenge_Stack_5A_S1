import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex px-8 py-4 items-center justify-between">
      <h1>RodeWise</h1>
      <div className="flex gap-8">
        <Button variant="ghost">Service</Button>
        <Button variant="ghost">FAQ</Button>
        <Button variant="ghost">About us</Button>
      </div>
      <div className="flex gap-4">
        <Button variant="secondary">Register</Button>
        <Button>Login</Button>
      </div>
    </header>
  );
};

export default Header;
