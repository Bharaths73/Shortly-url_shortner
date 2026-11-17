import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/toast";

function ShortUrlCreated({ shortLink, open = false, onClose }) {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(shortLink)
      .then(() => {
        toast.add({
          type: "success",
          description: "Short link copied to clipboard.",
        });
      })
      .catch(() => {
        toast.add({
          type: "error",
          description: "Failed to copy short link.",
        });
      });
  };

  return (
    <Dialog open={open}>
      <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="gap-2">
            <div className="mb-1 grid size-11 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <Copy className="size-5" aria-hidden="true" />
            </div>
            <DialogTitle className="text-xl tracking-tight">Your link is ready</DialogTitle>
            <DialogDescription className="leading-6">
              Your short link has been generated successfully. Copy it and share it anywhere.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-5">
            <Field>
              <Label htmlFor="short-link">Short Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  className="h-10 rounded-xl bg-muted/40"
                  id="short-link"
                  name="short-link"
                  value={shortLink}
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-10 shrink-0 rounded-xl"
                  onClick={handleCopy}
                  aria-label="Copy short link"
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-5">
            <DialogClose render={<Button variant="outline" className="rounded-xl" onClick={onClose}>
              Done
            </Button>} />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default ShortUrlCreated;
