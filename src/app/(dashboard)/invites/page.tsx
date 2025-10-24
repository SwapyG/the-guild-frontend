"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { MissionInvite } from "@/types";
import { getMyInvites, respondToInvite } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { FadeIn } from "@/components/animations/FadeIn";
import { Mail, Check, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

/* ✅ Fix type: Allow mission nested in mission_role */
type MissionInviteWithMission = MissionInvite & {
  mission_role: MissionInvite["mission_role"] & {
    mission?: {
      id: string;
      title: string;
    };
  };
};

// === Invite Card ===
const InviteCard = memo(function InviteCard({
  invite,
  onRespond,
}: {
  invite: MissionInviteWithMission;
  onRespond: (id: string, status: "Accepted" | "Declined") => void;
}) {
  const [isResponding, setIsResponding] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const glowColor = isDark
    ? "rgba(147,197,253,0.25)"
    : "rgba(59,130,246,0.2)";

  const handleResponse = async (status: "Accepted" | "Declined") => {
    setIsResponding(true);
    await onRespond(invite.id, status);
    setIsResponding(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 22px ${glowColor}`,
      }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <Card className="relative overflow-hidden border border-border/60 bg-card/60 backdrop-blur-md transition-all rounded-2xl">
        {/* Header */}
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-sm">
            <Avatar className="h-6 w-6">
              <AvatarImage src={invite.inviting_user.photo_url} />
              <AvatarFallback>
                {invite.inviting_user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span>
              Invitation from{" "}
              <span className="font-semibold">
                {invite.inviting_user.name}
              </span>
            </span>
          </CardDescription>
          <CardTitle className="text-lg font-semibold leading-tight text-foreground">
            {invite.mission_role.mission?.title ?? "Unknown Mission"}
          </CardTitle>
        </CardHeader>

        {/* Content */}
        <CardContent className="text-sm space-y-3">
          <div>
            <p className="font-semibold text-foreground/90">Role Invitation:</p>
            <p className="text-muted-foreground">
              {invite.mission_role.role_description}
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground/90">Required Skill:</p>
            <Badge variant="outline">
              {invite.mission_role.required_skill.name} (
              {invite.mission_role.proficiency_required})
            </Badge>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex gap-2 mt-auto pt-3">
          <Button
            className="flex-1"
            onClick={() => handleResponse("Accepted")}
            disabled={isResponding}
          >
            {isResponding ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Accept
          </Button>

          <Button
            variant="outline"
            className="flex-1 text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={() => handleResponse("Declined")}
            disabled={isResponding}
          >
            {isResponding ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <X className="h-4 w-4 mr-2" />
            )}
            Decline
          </Button>
        </CardFooter>

        {/* Glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 70%, ${glowColor}, transparent 70%)`,
          }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </Card>
    </motion.div>
  );
});

// === Main Invitations Page ===
export default function InvitationsPage() {
  const [invites, setInvites] = useState<MissionInviteWithMission[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchInvites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyInvites();
      setInvites(data);
    } catch {
      toast.error("Failed to load invitations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const handleResponse = async (
    inviteId: string,
    status: "Accepted" | "Declined"
  ) => {
    const toastId = toast.loading(`Responding to invitation...`);
    try {
      await respondToInvite(inviteId, status);
      toast.success(`Invitation ${status.toLowerCase()}.`, { id: toastId });
      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Failed to respond.";
      toast.error(detail, { id: toastId });
    }
  };

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: isDark
            ? "radial-gradient(700px circle at 0% 0%, rgba(59,130,246,0.12), transparent 60%), radial-gradient(700px circle at 100% 100%, rgba(147,197,253,0.08), transparent 60%)"
            : "radial-gradient(700px circle at 0% 0%, rgba(234,179,8,0.08), transparent 60%), radial-gradient(700px circle at 100% 100%, rgba(37,99,235,0.08), transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Header */}
      <FadeIn>
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight leading-tight">
            Mission Invitations
          </h1>
          <p className="text-muted-foreground">
            Review and respond to invitations from Mission Leads.
          </p>
        </div>
      </FadeIn>

      {/* Content */}
      <FadeIn delay={0.2}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-10 w-10 mb-4 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              Fetching Invitations...
            </p>
          </div>
        ) : invites.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {invites.map((invite) => (
                <InviteCard
                  key={invite.id}
                  invite={invite}
                  onRespond={handleResponse}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-2xl backdrop-blur-md bg-card/50 text-center"
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Mail className="h-10 w-10 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">You’re All Caught Up!</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              When new missions need your expertise, invitations will appear
              here instantly.
            </p>
          </motion.div>
        )}
      </FadeIn>
    </div>
  );
}
