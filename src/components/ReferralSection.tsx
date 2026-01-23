import { useState, useEffect } from "react";
import { Copy, Check, Users, Gift, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/backend/client";

interface Referral {
  id: string;
  referral_code: string;
  status: string;
  created_at: string;
  converted_at: string | null;
}

interface ReferralReward {
  id: string;
  reward_type: string;
  granted_at: string;
  expires_at: string | null;
  applied: boolean;
}

export function ReferralSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      // Fetch existing referrals
      const { data: referralData } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });

      if (referralData && referralData.length > 0) {
        setReferrals(referralData);
        setReferralCode(referralData[0].referral_code);
      }

      // Fetch rewards
      const { data: rewardData } = await supabase
        .from("referral_rewards")
        .select("*")
        .eq("user_id", user.id)
        .order("granted_at", { ascending: false });

      if (rewardData) {
        setRewards(rewardData);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReferralCode = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      // Generate a unique code
      const code = `UND${user.id.slice(0, 6).toUpperCase()}${Date.now().toString(36).toUpperCase()}`;

      const { data, error } = await supabase
        .from("referrals")
        .insert({
          referrer_id: user.id,
          referral_code: code,
        })
        .select()
        .single();

      if (error) throw error;

      setReferralCode(data.referral_code);
      setReferrals([data, ...referrals]);

      toast({
        title: "Referral code created",
        description: "Share your unique link to earn free Pro months.",
      });
    } catch (error) {
      console.error("Error generating referral code:", error);
      toast({
        title: "Error",
        description: "Failed to generate referral code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyReferralLink = async () => {
    if (!referralCode) return;

    const link = `${window.location.origin}/?ref=${referralCode}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Copied",
      description: "Referral link copied to clipboard.",
    });
  };

  const stats = {
    total: referrals.length,
    pending: referrals.filter((r) => r.status === "pending").length,
    converted: referrals.filter((r) => r.status === "converted" || r.status === "rewarded").length,
    freeMonths: rewards.filter((r) => r.reward_type === "free_month").length,
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">Refer Friends, Earn Free Pro</h3>
          <p className="text-sm text-muted-foreground">
            Share your referral link. When a friend subscribes to Pro, you both get a free month.
          </p>
        </div>
      </div>

      {/* Referral Link */}
      {referralCode ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={`${window.location.origin}/?ref=${referralCode}`}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyReferralLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Referrals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats.converted}</p>
              <p className="text-xs text-muted-foreground">Converted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.freeMonths}</p>
              <p className="text-xs text-muted-foreground">Free Months Earned</p>
            </div>
          </div>

          {/* Recent conversions */}
          {stats.converted > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-2">Recent Conversions</p>
              <div className="space-y-2">
                {referrals
                  .filter((r) => r.status === "converted" || r.status === "rewarded")
                  .slice(0, 3)
                  .map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        Referral converted
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {referral.status === "rewarded" ? "Rewarded" : "Pending Reward"}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button onClick={generateReferralCode} disabled={isGenerating}>
          {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Users className="w-4 h-4 mr-2" />
          Generate Referral Link
        </Button>
      )}
    </Card>
  );
}
