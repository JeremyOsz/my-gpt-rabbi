// Description: Card component

import { type ReactElement } from "react";

type CardProps = {
    children: React.ReactNode,
};

const Card = ({ children }: CardProps ) : ReactElement => {
    return (
        <div className="flex flex-col gap-1 rounded-xl bg-amber-50 p-12 text-black">
            {children}
        </div>
    );
};

export default Card;