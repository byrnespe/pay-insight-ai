import { useState } from "react";
import { CalendarIcon, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/backend/client";

interface TimelineEntryFormProps {
  onSuccess: () => void;
}

export function TimelineEntryForm({ onSuccess }: TimelineEntryFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    recorded_at: new Date().toISOString().split("T")[0],
    job_title: "",
    company: "",
    base_salary: "",
    bonus: "",
    equity_value: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("salary_timeline").insert({
        user_id: user.id,
        recorded_at: formData.recorded_at,
        job_title: formData.job_title,
        company: formData.company || null,
        base_salary: parseInt(formData.base_salary),
        bonus: formData.bonus ? parseInt(formData.bonus) : 0,
        equity_value: formData.equity_value ? parseInt(formData.equity_value) : 0,
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast({
        title: "Entry added",
        description: "Your salary milestone has been recorded.",
      });

      setOpen(false);
      setFormData({
        recorded_at: new Date().toISOString().split("T")[0],
        job_title: "",
        company: "",
        base_salary: "",
        bonus: "",
        equity_value: "",
        notes: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error adding timeline entry:", error);
      toast({
        title: "Error",
        description: "Failed to add entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Salary Milestone</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recorded_at">Date</Label>
              <div className="relative">
                <Input
                  id="recorded_at"
                  type="date"
                  value={formData.recorded_at}
                  onChange={(e) =>
                    setFormData({ ...formData, recorded_at: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                placeholder="e.g., Senior Engineer"
                value={formData.job_title}
                onChange={(e) =>
                  setFormData({ ...formData, job_title: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (optional)</Label>
            <Input
              id="company"
              placeholder="e.g., Acme Corp"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base_salary">Base Salary</Label>
              <Input
                id="base_salary"
                type="number"
                placeholder="80000"
                value={formData.base_salary}
                onChange={(e) =>
                  setFormData({ ...formData, base_salary: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bonus">Bonus</Label>
              <Input
                id="bonus"
                type="number"
                placeholder="0"
                value={formData.bonus}
                onChange={(e) =>
                  setFormData({ ...formData, bonus: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equity_value">Equity Value</Label>
              <Input
                id="equity_value"
                type="number"
                placeholder="0"
                value={formData.equity_value}
                onChange={(e) =>
                  setFormData({ ...formData, equity_value: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="e.g., Promotion from mid-level, new equity grant"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Entry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
