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
      .catch((err) => {
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
          <DialogHeader>
            <DialogTitle>Short Link Created</DialogTitle>
            <DialogDescription>
              Your short link has been generated successfully.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="short-link">Short Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="short-link"
                  name="short-link"
                  value={shortLink}
                  readOnly
                />
                <Copy onClick={handleCopy} className="cursor-pointer size-5" />
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" onClick={onClose}>
              Cancel
            </Button>} />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default ShortUrlCreated;
