import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className = "", ...rest }: CardProps) => {
  return (
    <div
      className={`rounded-2xl shadow-md bg-white p-4 transition-all ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const CardContent = ({ children, className = "", ...rest }: CardContentProps) => {
  return (
    <div className={`mt-2 ${className}`} {...rest}>
      {children}
    </div>
  );
};
