import { type Author } from "../../utils/types";

type Props = {
  author: Author;
};

export const Avatar = ({ author }: Props) => {
  if (author === "AI") {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
        Rabbi
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-400 text-sm font-semibold text-white">
      Student
    </div>
  );
};
