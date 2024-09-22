import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils/tw";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import type { To } from "react-router-dom";
import { Link } from "react-router-dom";
import type { Pagination as IPagination } from "@/types/api";

const PaginationContainer = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
PaginationContainer.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & ButtonProps & { to: To };

const PaginationLink = ({
  isActive,
  className,
  ...props
}: PaginationLinkProps) => {
  return (
    <Button
      as={Link}
      aria-current={isActive ? "page" : undefined}
      size="icon"
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        className,
        {
          "font-bold": isActive,
        },
        "size-10",
      )}
      {...props}
    />
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" {...props}>
    <ChevronLeft className="size-4" />
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" {...props}>
    <ChevronRight className="size-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

type PaginationProps = {
  pagination: IPagination;
};

const Pagination: React.FC<React.ComponentProps<"nav"> & PaginationProps> = ({
  className,
  pagination,
  ...props
}) => {
  return (
    <PaginationContainer className={cn(className)} {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={{
              search: `?page=${pagination.page - 1}`,
            }}
            disabled={pagination.page === 1}
          />
        </PaginationItem>
        {Array.from({ length: pagination.pages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              // disabled={i + 1 === pagination.page}
              to={{
                search: `?page=${i + 1}`,
              }}
              isActive={i + 1 === pagination.page}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            to={{ search: `?page=${pagination.page + 1}` }}
            disabled={pagination.page === pagination.pages}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationContainer>
  );
};

export {
  Pagination,
  PaginationContainer,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
