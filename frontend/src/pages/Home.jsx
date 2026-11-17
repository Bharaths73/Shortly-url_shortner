import { generateShortLink } from "@/Api/linksApi";
import ShortUrlCreated from "@/components/AppComponents/ShortUrlCreatedDailog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, Link2, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import heroArt from "@/assets/hero.png";

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
    onError: () => {
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
    <main className="home-page">
      {isDialogOpen && (
        <ShortUrlCreated
          shortLink={shortLink}
          open={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
      <section className="home-hero">
        <div className="home-copy">
          <div className="home-kicker">
            <Sparkles aria-hidden="true" className="size-4" />
            A little link goes a long way
          </div>
          <h1 className="home-title">
            Make every link
            <br />
            <span>go further.</span>
          </h1>
          <p className="home-description">
            Turn long, cluttered URLs into clean links that are easy to share.
            Create them here, then keep every destination organized in your
            workspace.
          </p>

          <div className="shortener-panel">
            <label className="shortener-label" htmlFor="long-url">
              Paste your destination URL
            </label>
            <div className="shortener-controls">
              <div className="shortener-input-wrap">
                <Link2 aria-hidden="true" className="size-4" />
                <Input
                  id="long-url"
                  className="shortener-input"
                  type="url"
                  placeholder="https://example.com/your-long-link"
                  value={longUrl}
                  onChange={handleInputChange}
                />
              </div>
              <Button
                className="shortener-button flex items-center gap-2"
                disabled={isPending || !longUrl}
                onClick={() => handleShortenLink(longUrl)}
              >
                {isPending ? (
                  <>
                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                    Creating link…
                  </>
                ) : (
                  <>
                    Shorten link
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </>
                )}
              </Button>
            </div>
            <p className="shortener-note">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              Your links are ready to share in seconds.
            </p>
          </div>

          <div className="home-assurances">
            <span>
              <Check aria-hidden="true" className="size-4" />
              Simple to create
            </span>
            <span>
              <Check aria-hidden="true" className="size-4" />
              Easy to manage
            </span>
            <span>
              <Check aria-hidden="true" className="size-4" />
              Made for sharing
            </span>
          </div>
        </div>

        <div className="home-art" aria-hidden="true">
          <div className="home-art__glow" />
          <img className="home-art__image" src={heroArt} alt="" />
          <div className="home-art__note">
            <Link2 className="size-4" />
            A cleaner way to share
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
