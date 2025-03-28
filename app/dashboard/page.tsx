"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Divider,
  Chip,
  Skeleton,
} from "@heroui/react";

import { useAuth } from "../../context/auth-context";

import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import PushNotificationManager from "@/components/push";

export default function Dashboard() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();

  // redirects to signin page if no user
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  if (!user && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader className="flex flex-col gap-2 items-center py-6">
            <Skeleton className="h-8 w-40 rounded-lg mb-2" />
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-8 w-40 rounded-lg mb-2" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <Card className="mb-6 shadow-md">
          <CardHeader className="flex items-center gap-4">
            <Skeleton className="rounded-full w-14 h-14" />
            <div className="flex-grow">
              <Skeleton className="h-8 w-40 rounded-lg mb-2" />
              <Skeleton className="h-4 w-60 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-24 rounded-lg" />
          </CardHeader>

          <Divider />

          <CardBody>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-48 rounded-lg mb-4" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-28 rounded-lg" />
                    <Skeleton className="h-8 w-40 rounded-lg" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-28 rounded-lg" />
                    <Skeleton className="h-8 w-64 rounded-lg" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-28 rounded-lg" />
                    <Skeleton className="h-8 w-10 rounded-lg" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-8 w-36 rounded-lg mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-10 w-48 rounded-lg" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // if no user, force refresh useEffect
  if (!user) {
    return null;
  }
  const userName = user.user_metadata.name ?? "User";
  const provider = user.app_metadata.provider ?? "Unknown";

  function getUserAvatar(): string {
    switch (provider.toLowerCase()) {
      case "github":
        return user?.user_metadata.avatar_url ?? "";
      default:
        return "";
    }
  }

  function getProviderIcon() {
    switch (provider.toLowerCase()) {
      case "github":
        return <GithubIcon size={25} />;
      default:
        return null;
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <Card className="mb-6 shadow-md">
        <CardHeader className="flex items-center gap-4">
          <Avatar color="primary" size="lg" src={getUserAvatar()} />
          <div className="flex-grow">
            <h2
              className={title({
                color: "blue",
                size: "sm",
              })}
            >
              {userName}
            </h2>
            <p className="text-sm text-default-500">
              Last login:{" "}
              <span className="font-medium">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "No sign-in time available"}
              </span>
            </p>
          </div>
          <Button color="danger" variant="ghost" onPress={signOut}>
            Sign Out
          </Button>
        </CardHeader>

        <Divider />

        <CardBody>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <h3
                className={subtitle({
                  fullWidth: true,
                  class: "!my-3 !text-xl font-semibold",
                })}
              >
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-base w-28">User ID:</span>
                  <Chip size="lg" variant="flat">
                    {user.id}
                  </Chip>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-base w-28">Email:</span>
                  <Chip color="primary" size="lg" variant="flat">
                    {user.email ?? "No email provided"}
                  </Chip>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-base w-28">Provider:</span>
                  {getProviderIcon()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3
                className={subtitle({
                  fullWidth: true,
                  class: "!my-3 !text-xl font-semibold",
                })}
              >
                Notifications
              </h3>
              <PushNotificationManager />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
