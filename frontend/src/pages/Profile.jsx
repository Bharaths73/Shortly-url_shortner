import {
  BadgeCheck,
  Loader2,
  LockKeyhole,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserPassword, updateUserProfile } from "@/Api/UserApi";
import { setCredentials } from "@/redux/slices/user";
import { toast } from "@/components/ui/toast";
import { useMutation } from "@tanstack/react-query";

function Profile() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(
    user?.firstName || "First Name is not provided",
  );
  const [lastName, setLastName] = useState(
    user?.lastName || "Last Name is not provided",
  );
  const [email, setEmail] = useState(user?.email || "Email is not provided");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ firstName, lastName, email });
  const [profileNotice, setProfileNotice] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Shortly member";
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const startEditing = () => {
    setDraft({ firstName, lastName, email });
    setProfileNotice("");
    setIsEditing(true);
  };

  const {
    mutate: updateProfile,
    isPending,
  } = useMutation({
    mutationFn: updateUserProfile,
    retry: false,
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user:data,
          accessToken: data.accessToken,
        }),
      );
      localStorage.setItem("accessToken", data.accessToken);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      setIsEditing(false);
      toast.add({
        type: "success",
        description: "Profile Successfully Updated.",
      });
    },
    onError: (error) => {
      console.error("Error during short link generation:", error);
      console.error("Stack:", error.stack);
      toast.add({
        type: "error",
        description: error?.message,
      });
    },
  });

  const {
    mutate: updatePassword,
    isPending: passwordSubmissionPending,
  } = useMutation({
    mutationFn: updateUserPassword,
    retry: false,
    onSuccess: () => {
      setPasswords({
        current: "",
        next: "",
        confirm: "",
      });
      toast.add({
        type: "success",
        description: "Password Successfully Updated.",
      });
    },
    onError: (error) => {
      console.error("Error during short link generation:", error);
      console.error("Stack:", error.stack);
      setPasswords({
        current: "",
        next: "",
        confirm: "",
      });
      toast.add({
        type: "error",
        description: error?.data?.message || "Failed to update password"
      });
    },
  });

  const saveProfilePreview = (event) => {
    event.preventDefault();
    const updatedProfile = {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
    };

    updateProfile(updatedProfile);
  };

  const closePasswordForm = () => {
    setIsChangingPassword(false);
    setPasswordNotice("");
    setPasswords({ current: "", next: "", confirm: "" });
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (passwords.next !== passwords.confirm) {
      setPasswordNotice("The new passwords do not match.");
      return;
    }
    updatePassword(passwords);
  };

  return (
    <div className="profile-page space-y-6 pb-10">
      <header className="page-header mb-6">
        <div>
          <span className="page-eyebrow">ACCOUNT</span>
          <h1 className="page-title">Profile settings</h1>
          <p className="page-description">
            Your personal details and account security.
          </p>
        </div>
      </header>

      <section className="profile-identity">
        <div className="profile-avatar">
          <p>{initials || "S"}</p>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {fullName}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
              Active account
            </span>
          </div>
          <p className="mt-1.5 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="truncate">{email || "No email address"}</span>
          </p>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr] mt-5">
        <section className="profile-card">
          <div className="profile-card__header justify-between">
            <div className="flex items-center gap-3">
              <div className="profile-card__icon">
                <UserRound aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Personal information</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Your name and email
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                className="shrink-0 gap-2"
                onClick={startEditing}
              >
                <Pencil aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">Edit profile</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            )}
          </div>

          {isEditing ? (
            <form
              onSubmit={saveProfilePreview}
              className="space-y-5 p-5 sm:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-first-name">First name</Label>
                  <Input
                    id="profile-first-name"
                    autoComplete="given-name"
                    required
                    value={draft.firstName}
                    onChange={(event) =>
                      setDraft({ ...draft, firstName: event.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-last-name">Last name</Label>
                  <Input
                    id="profile-last-name"
                    autoComplete="family-name"
                    value={draft.lastName}
                    onChange={(event) =>
                      setDraft({ ...draft, lastName: event.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="profile-email">Email address</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={draft.email}
                    onChange={(event) =>
                      setDraft({ ...draft, email: event.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-2"
                  onClick={() => setIsEditing(false)}
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" className="gap-2 flex items-center" disabled={isPending}>
                  {isPending && <Loader2 className="animate-spin"/>}
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <dl className="px-5 sm:px-6">
              <div className="profile-row">
                <dt className="text-sm text-muted-foreground">First name</dt>
                <dd className="text-right text-sm font-medium">{firstName}</dd>
              </div>
              <div className="profile-row">
                <dt className="text-sm text-muted-foreground">Last name</dt>
                <dd className="text-right text-sm font-medium">{lastName}</dd>
              </div>
              <div className="profile-row">
                <dt className="text-sm text-muted-foreground">Email address</dt>
                <dd className="break-all text-right text-sm font-medium">
                  {email || "Not provided"}
                </dd>
              </div>
            </dl>
          )}
          {profileNotice && !isEditing && (
            <p
              role="status"
              className="border-t bg-muted/40 px-6 py-3 text-sm text-muted-foreground sm:px-7"
            >
              {profileNotice}
            </p>
          )}
        </section>

        <section className="profile-card">
          <div className="profile-card__header">
            <div className="profile-card__icon profile-card__icon--green">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Password & security</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Protect your account
              </p>
            </div>
          </div>

          {isChangingPassword ? (
            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-4 p-5 sm:p-6"
            >
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={passwords.current}
                  onChange={(event) =>
                    setPasswords({ ...passwords, current: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={passwords.next}
                  onChange={(event) =>
                    setPasswords({ ...passwords, next: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={passwords.confirm}
                  onChange={(event) =>
                    setPasswords({ ...passwords, confirm: event.target.value })
                  }
                />
              </div>
              {passwordNotice && (
                <p role="status" className="text-sm text-muted-foreground">
                  {passwordNotice}
                </p>
              )}
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-2"
                  onClick={closePasswordForm}
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" className="gap-2 flex items-center gap-x-2" disabled={passwordSubmissionPending}>
                  {passwordSubmissionPending && <Loader2 className="animate-spin"/>}
                  Update
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
                  <LockKeyhole aria-hidden="true" className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Hidden for your security
                  </p>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Choose a strong, unique password to keep your links and account
                secure.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  setPasswordNotice("");
                  setIsChangingPassword(true);
                }}
              >
                <LockKeyhole aria-hidden="true" className="h-4 w-4" />
                Change password
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
