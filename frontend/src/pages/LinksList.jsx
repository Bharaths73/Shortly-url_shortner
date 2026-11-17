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
  PaginationEllipsis,
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
import { ChartNoAxesColumn } from "lucide-react";

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
    isFetching,
    isError,
    error,
    isPlaceholderData,
    refetch
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
      <div className="text-2xl text-gray-600 mx-auto my-auto w-full flex justify-center">
        Something Went Wrong
      </div>
    );
  }

  if (isPending) {
    return <p className="text-center">Loading links...</p>;
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Link Library</h1>
        <p className="text-sm text-muted-foreground">
          All your shortened URLs, organized in one place.
        </p>
      </div>
      <Table className="table-fixed w-full mt-3">
        <TableCaption>A list of your Shortened URLs.</TableCaption>
        <TableHeader>
          <TableRow>
            {links_list.map((link) => (
              <TableHead className={`${link.width} text-sm font-semibold text-center`} key={link.key}>
                {link.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {linkDetails?.urls?.length > 0 ? (
            linkDetails?.urls.map((link) => (
              <TableRow key={link.shortCode}>
                <TableCell className="font-medium max-w-0 p-3">
                  <a
                    href={link.shortCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate hover:underline"
                    title={link.shortCode}
                    onClick={()=>handleShortUrlClick(link.shortCode)}
                  >
                    {link.shortCode}
                  </a>
                </TableCell>
                <TableCell className="max-w-0">
                  <p
                    rel="noopener noreferrer"
                    className="block truncate"
                    title={link.originalUrl}
                  >
                    {link.originalUrl}
                  </p>
                </TableCell>
                <TableCell>{formatDateTime(link.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-x-5 justify-center">
                    <ChartNoAxesColumn/>
                    <p className="mt-1 text-sm font-semibold">{link.totalClicks}</p>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={links_list.length} className="text-center">
                No shortened URLs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="text-right" colSpan={links_list.length}>
              <Pagination className="mx-0 w-auto">
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
    </div>
  );
}

export default LinksList;
