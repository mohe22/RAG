import { Button } from "@/components/ui/button";
import { Spinner as SP } from "./spinner";

const Spinner = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <SP size={50} />
    </div>
  );
};

const SpinnerInverted = () => {
  return (
    <div className="bg-foreground flex w-full h-screen justify-center items-center">
      <SP size={50} invert />
    </div>
  );
};

const SpinnerWithButton = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <Button disabled>
        <SP invert className="me-2" /> Button With Spinner
      </Button>
    </div>
  );
};

export { Spinner, SpinnerInverted, SpinnerWithButton };
