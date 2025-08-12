import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type TPaginationSectionProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};
export default function PaginationSection({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: TPaginationSectionProps) {
  const pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const maxPageNum = 3; // Maximum page numbers to display at once
  const pageNumLimit = Math.floor(maxPageNum / 2); // Current page should be in the middle if possible

  const activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length),
  );

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // const handlePrevPageLast = () => {
  //     if (currentPage > 1) {
  //         setCurrentPage(1);
  //     }
  // };

  // const handleNextPageLast = () => {
  //     if (currentPage < pageNumbers.length) {
  //         setCurrentPage(pageNumbers.length);
  //     }
  // };

  // Function to render page numbers with ellipsis
  const renderPages = () => {
    const renderedPages = activePages.map((page, idx) => (
      <PaginationItem
        key={idx}
        className={
          currentPage === page
            ? "rounded-md border bg-primary text-white border-primary"
            : "hover:text-primary hover:border-primary transition-colors"
        }
      >
        <PaginationLink onClick={() => setCurrentPage(page)}>
          {page}
        </PaginationLink>
      </PaginationItem>
    ));

    if (activePages[0] > 2 && activePages[activePages.length - 1] > 2) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => setCurrentPage(activePages[0] - 1)}
        />,
      );
    }

    // Add ellipsis at the end if necessary
    if (activePages[activePages.length - 1] + 1 < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() =>
            setCurrentPage(activePages[activePages.length - 1] + 1)
          }
        />,
      );
    }

    if (
      activePages[0] > 1 &&
      Math.ceil(totalItems / itemsPerPage) > 5 &&
      currentPage > 2
    ) {
      renderedPages.unshift(
        <PaginationLink
          onClick={() => setCurrentPage(1)}
          className="hover:text-primary hover:border-primary transition-colors"
        >
          1
        </PaginationLink>,
      );
    }

    if (
      activePages[0] > 2 &&
      Math.ceil(totalItems / itemsPerPage) > 5 &&
      Math.ceil(totalItems / itemsPerPage) - currentPage > 1
    ) {
      renderedPages.push(
        <PaginationLink
          onClick={() => setCurrentPage(Math.ceil(totalItems / itemsPerPage))}
          className="hover:text-primary hover:border-primary transition-colors"
        >
          {Math.ceil(totalItems / itemsPerPage)}
        </PaginationLink>,
      );
    }

    return renderedPages;
  };

  return (
    <div className="p-4">
      {totalItems > itemsPerPage && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevPage}
                className="hover:text-primary hover:border-primary transition-colors cursor-pointer p-2 text-black shadow-card-shadow"
              />
            </PaginationItem>

            {renderPages()}

            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className="hover:text-primary hover:border-primary transition-colors cursor-pointer p-2 text-black shadow-card-shadow"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
