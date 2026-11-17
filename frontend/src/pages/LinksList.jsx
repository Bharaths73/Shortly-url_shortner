import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { queryDefaults } from "@/tanstackQueries/queryDefaults";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLinksPage } from "@/Api/linksApi";
import { useSelector } from "react-redux";
import { useState } from "react";
import { ArrowRight, ChartNoAxesColumn, CircleAlert, Link2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const links_list = [
  {
    header: "Short URL",
    key: "shortUrl",
    width: "w-[100px]",
  },
  {
    header: "Original URL",
    key: "originalUrl",
    width: "w-[200px]",
  },
  {
    header: "Created At",
    key: "createdAt",
    width: "w-[150px]",
  },
  {
    header: "Total Visits",
    key: "totalVisits",
    width: "w-[100px]",
  },
];

export function LinksList() {
  const { user } = useSelector((state) => state.user);
  const userId = user?.id;
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  const {
    data: linkDetails,
    isPending,
    isError,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["links", userId, page, pageSize],
    queryFn: () => getLinksPage(userId, page, pageSize),
    ...queryDefaults,
    enabled: !!userId,
    placeholderData: (previousData) => previousData,
  });

  const handleShortUrlClick = (shortCode) => {
  queryClient.setQueryData(
    ["links", userId, page, pageSize],
    (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        urls: oldData.urls.map((link) =>
          link.shortCode === shortCode
            ? { ...link, totalClicks: link.totalClicks + 1 }
            : link
        ),
      };
    }
  );
  queryClient.invalidateQueries({ queryKey: ["dashboard",user.id] });
};

  if (isError) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="flex max-w-sm flex-col items-center text-center">
          <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <CircleAlert className="size-5" />
          </span>
          <h1 className="text-lg font-semibold tracking-tight">Your links couldn’t load</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Please try again in a little while. Your saved links are still here.
          </p>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="grid min-h-[50vh] place-items-center" aria-live="polite">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Link2 className="size-4" />
          </span>
          Loading your links…
        </div>
      </div>
    );
  }

  return (
    <div className="links-page">
      <header className="page-header">
        <div>
          <span className="page-eyebrow">LINK LIBRARY</span>
          <h1 className="page-title">Your links</h1>
          <p className="page-description">
            All your shortened URLs, organized in one place.
          </p>
        </div>
        <Button
          render={<Link to="/home" />}
          className="hidden gap-2 rounded-xl px-4 sm:inline-flex"
        >
          <Plus className="size-4" />
          Create a link
        </Button>
      </header>
      <section className="links-card" aria-label="Shortened URLs">
        <Table className="links-table table-fixed">
          <TableCaption className="sr-only">A list of your shortened URLs.</TableCaption>
          <TableHeader>
            <TableRow>
              {links_list.map((link) => (
                <TableHead className={`${link.width} text-center`} key={link.key}>
                  {link.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {linkDetails?.urls?.length > 0 ? (
              linkDetails.urls.map((link) => (
                <TableRow key={link.shortCode}>
                  <TableCell className="max-w-0 p-3">
                    <a
                      href={link.shortCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-link block truncate"
                      title={link.shortCode}
                      onClick={() => handleShortUrlClick(link.shortCode)}
                    >
                      {link.shortCode}
                    </a>
                  </TableCell>
                  <TableCell className="max-w-0">
                    <p
                      className="block truncate"
                      title={link.originalUrl}
                    >
                      {link.originalUrl}
                    </p>
                  </TableCell>
                  <TableCell>{formatDateTime(link.createdAt)}</TableCell>
                  <TableCell className="text-center">
                    <span className="link-visits">
                      <ChartNoAxesColumn className="size-4" />
                      <span className="font-semibold">{link.totalClicks}</span>
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={links_list.length} className="py-16 text-center">
                  <div className="mx-auto flex max-w-xs flex-col items-center">
                    <span className="mb-3 grid size-11 place-items-center rounded-2xl bg-violet-50 text-violet-600">
                      <Link2 className="size-5" />
                    </span>
                    <span className="font-semibold text-foreground">No links yet</span>
                    <span className="mt-1 text-sm text-muted-foreground">
                      Shorten a URL and it’ll appear here.
                    </span>
                    <Button
                      render={<Link to="/home" />}
                      className="mt-4 gap-2 rounded-xl"
                      size="sm"
                    >
                      Create your first link
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="bg-white">
            <TableRow>
              <TableCell className="text-right" colSpan={links_list.length}>
                <Pagination className="link-pagination mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();

                          if (!isPlaceholderData && !linkDetails.firstPage) {
                            setPage((prev) => prev - 1);
                          }
                        }}
                        className={
                          linkDetails.firstPage || isPlaceholderData
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    <PaginationLink isActive>{page + 1}</PaginationLink>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();

                          if (!isPlaceholderData && !linkDetails.lastPage) {
                            setPage((prev) => prev + 1);
                          }
                        }}
                        className={
                          linkDetails.lastPage || isPlaceholderData
                            ? "pointer-events-none opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    </div>
  );
}

export default LinksList;
