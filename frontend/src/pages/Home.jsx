import { generateShortLink } from "@/Api/linksApi";
import ShortUrlCreated from "@/components/AppComponents/ShortUrlCreatedDailog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const handleInputChange = (e) => {
    setLongUrl(e.target.value);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const {
    mutate: shortenLink,
    isPending,
    isSuccess,
    isError,
    error,
    data,
  } = useMutation({
    mutationFn: generateShortLink,
    retry: false,
    onSuccess: (data) => {
      setLongUrl("");
      setShortLink(data.shortCode);
      setIsDialogOpen(true);
      queryClient.invalidateQueries({
        queryKey: ["links"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", user.id],
      });
    },
    onError: (error) => {
      toast.add({
        type: "error",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  const handleShortenLink = (longUrl) => {
    shortenLink({ originalUrl: longUrl });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      {isDialogOpen && (
        <ShortUrlCreated
          shortLink={shortLink}
          open={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
      <div className="flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Shorten URLs.
            <span className="text-primary"> Share More.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Transform long, messy URLs into short, shareable links. Create,
            manage, and track your links effortlessly with Shortly.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Input
            className="h-12 flex-1 text-base"
            type="url"
            placeholder="Paste your long URL here..."
            value={longUrl}
            onChange={handleInputChange}
          />

          <Button
            className="h-12 px-8 text-base cursor-pointer flex items-center gap-x-2"
            disabled={isPending || !longUrl}
            onClick={() => handleShortenLink(longUrl)}
          >
            {isPending && <Loader2 className="animate-spin" />}
            Shorten URL
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Simple, fast, and reliable URL shortening.
        </p>
      </div>
    </div>
  );
}

export default Home;
