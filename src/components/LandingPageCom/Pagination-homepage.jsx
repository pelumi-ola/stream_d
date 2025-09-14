"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export default function PaginationHomepage({ metadata, onPageChange }) {
  if (!metadata || metadata.total_pages <= 1) return null;

  const {
    page: currentPage,
    total_pages,
    has_previous,
    has_next,
    previous_page,
    next_page,
  } = metadata;

  const goToPage = (page) => {
    if (page < 1 || page > total_pages) return;
    onPageChange(page);
  };

  // Build visible page numbers
  const visiblePages = [];
  const delta = 2;

  for (let i = 1; i <= total_pages; i++) {
    if (
      i === 1 ||
      i === total_pages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      visiblePages.push(i);
    } else if (
      (i === currentPage - delta - 1 && i > 1) ||
      (i === currentPage + delta + 1 && i < total_pages)
    ) {
      visiblePages.push("...");
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (has_previous && previous_page) goToPage(previous_page);
            }}
            className={!has_previous ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {visiblePages.map((p, i) =>
          p === "..." ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href={`?page=${p}`}
                isActive={currentPage === p}
                className={`${
                  currentPage === p
                    ? "bg-primary text-white rounded-md"
                    : "hover:bg-gray-100"
                } px-3 py-1`}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (has_next && next_page) goToPage(next_page);
            }}
            className={!has_next ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
