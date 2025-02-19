import { FC } from "react";

interface MainComponentProps {
  testCase: string;
  testScript: string;
}

const MainComponent: FC<MainComponentProps> = ({ testCase, testScript }) => {
  return (
    <div>
      <h2>Generated Test Case</h2>
      <div>{testCase}</div>
      <h2>Generated Test Script</h2>
      <div>{testScript}</div>
    </div>
  );
};

export default MainComponent;
