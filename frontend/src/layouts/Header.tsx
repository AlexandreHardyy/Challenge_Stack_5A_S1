import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-slate-300 flex py-4 px-6 items-center justify-between">
      <h1>RodeWise</h1>
      <div className="flex gap-8">
        <Button variant="ghost">Service</Button>
        <Button variant="ghost">FAQ</Button>
        <Button variant="ghost">About us</Button>
      </div>
      <Button>Start now</Button>
    </div>
  );
};

export default Header;
